// src/api/axios.js

import axios from "axios";

/* =========================================
   API CONFIG
========================================= */

const baseURL =
  import.meta.env.VITE_API_URL ||
  import.meta.env
    .VITE_BASE_API_URL ||
  "http://localhost:4000/api";

const API = axios.create({
  baseURL,

  timeout: 30000,

  withCredentials: true,

  headers: {
    "Content-Type":
      "application/json",
  },
});

/* =========================================
   TOKEN STORAGE
========================================= */

const TOKEN_KEY = "token";

const AUTH_STORAGE_KEYS = [
  "token",
  "user",
  "role",
  "refreshToken",
];

const getAccessToken = () =>
  localStorage.getItem(TOKEN_KEY);

const setAccessToken = (
  token
) => {
  localStorage.setItem(
    TOKEN_KEY,
    token
  );
};

const clearAuthStorage = () => {
  AUTH_STORAGE_KEYS.forEach(
    (key) =>
      localStorage.removeItem(
        key
      )
  );

  sessionStorage.clear();
};

/* =========================================
   REQUEST INTERCEPTOR
========================================= */

API.interceptors.request.use(
  (config) => {
    const token =
      getAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },

  Promise.reject
);

/* =========================================
   REFRESH STATE
========================================= */

let isRefreshing = false;

let failedQueue = [];

/* =========================================
   QUEUE HANDLER
========================================= */

const processQueue = (
  error,
  token = null
) => {
  failedQueue.forEach(
    ({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve(token);
      }
    }
  );

  failedQueue = [];
};

/* =========================================
   REFRESH ACCESS TOKEN
========================================= */

const refreshAccessToken =
  async () => {
    const { data } =
      await axios.post(
        `${baseURL}/auth/refresh-token`,
        {},
        {
          withCredentials: true,
        }
      );

    const accessToken =
      data?.accessToken;

    if (!accessToken) {
      throw new Error(
        "Access token missing"
      );
    }

    setAccessToken(
      accessToken
    );

    API.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

    return accessToken;
  };

/* =========================================
   RESPONSE INTERCEPTOR
========================================= */

API.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest =
      error.config;

    const status =
      error.response?.status;

    const message =
      error.response?.data
        ?.message ||
      error.message;

    /* =====================================
       NETWORK ERROR
    ===================================== */

    if (!error.response) {
      console.error(
        "Network Error:",
        message
      );

      return Promise.reject(error);
    }

    if (status >= 500) {
      console.error(
        `API Error ${status}:`,
        message
      );
    }

    /* =====================================
       UNAUTHORIZED
    ===================================== */

    const isAuthFlowRequest = /\/auth\/(admin|business|customer)\/login|\/auth\/(login|register|verify-otp|reset-password|forgot-password)/i.test(
      originalRequest?.url || ""
    );

    if (isAuthFlowRequest) {
      return Promise.reject(error);
    }

    if (
      status === 401 &&
      !originalRequest?._retry
    ) {
      if (isRefreshing) {
        return new Promise(
          (resolve, reject) => {
            failedQueue.push({
              resolve,
              reject,
            });
          }
        )
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;

            return API(
              originalRequest
            );
          })
          .catch(
            Promise.reject
          );
      }

      originalRequest._retry = true;

      isRefreshing = true;

      try {
        const newToken =
          await refreshAccessToken();

        processQueue(
          null,
          newToken
        );

        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return API(originalRequest);
      } catch (refreshError) {
        processQueue(
          refreshError
        );

        clearAuthStorage();

        if (
          window.location.pathname !==
          "/welcome"
        ) {
          window.location.href =
            "/welcome";
        }

        return Promise.reject(
          refreshError
        );
      } finally {
        isRefreshing = false;
      }
    }

    /* =====================================
       ERROR LOGGING
    ===================================== */

    if (status >= 500) {
      console.error(
        "Server Error:",
        message
      );
    }

    return Promise.reject(error);
  }
);

export default API;