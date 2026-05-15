import API from "./axios";

/* =========================
   USER PROFILE
========================= */

/* GET CURRENT USER */
export const getCurrentUser = () => {
  return API.get("/users/me");
};

/* (alias – optional but clean) */
export const getUserProfile = getCurrentUser;

/* GET USER BY ID */
export const getUserById = (id) => {
  return API.get(`/users/${id}`);
};

/* =========================
   UPDATE PROFILE (MAIN)
   → name, email, avatar
========================= */
export const updateProfile = (formData) => {
  return API.put("/users/profile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

/* =========================
   DELETE ACCOUNT
========================= */
export const deleteAccount = () => {
  return API.delete("/users/me");
};