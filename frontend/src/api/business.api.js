// src/api/business.api.js
import API from "./axios";

/* =========================================
   GET BUSINESSES (PAGINATED + FILTERABLE)
========================================= */
export const getBusinesses = async (params = {}) => {
  const {
    page = 1,
    limit = 10,
    category = "",
  } = params;

  return API.get("/business", {
    params: {
      page,
      limit,
      category: category || undefined, // avoid sending empty string
    },
  });
};

/* =========================================
   GET SINGLE BUSINESS
========================================= */
export const getBusinessById = (id) => {
  return API.get(`/business/${id}`);
};

/* =========================================
   CREATE BUSINESS
========================================= */
export const createBusiness = (formData) => {
  return API.post("/business", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

/* =========================================
   UPDATE BUSINESS
========================================= */
export const updateBusiness = (id, formData) => {
  return API.put(`/business/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

/* =========================================
   DELETE BUSINESS
========================================= */
export const deleteBusiness = (id) => {
  return API.delete(`/business/${id}`);
};