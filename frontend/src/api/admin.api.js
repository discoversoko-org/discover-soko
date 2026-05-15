import API from "./axios";


/* =========================
   🏢 BUSINESS MANAGEMENT
========================= */

/* 📌 GET PENDING BUSINESSES */
export const getPendingBusinesses = () => {
  return API.get("/admin/business/pending");
};

/* 📌 APPROVE BUSINESS */
export const approveBusiness = (id) => {
  return API.put(`/admin/business/${id}/approve`);
};

/* 📌 REJECT BUSINESS */
export const rejectBusiness = (id, reason) => {
  return API.put(`/admin/business/${id}/reject`, { reason });
};

/* 📌 DELETE BUSINESS */
export const deleteBusinessAdmin = (id) => {
  return API.delete(`/admin/business/${id}`);
};


/* =========================
   👤 USER MANAGEMENT
========================= */

/* 📌 GET ALL USERS */
export const getAllUsers = () => {
  return API.get("/admin/users");
};

/* (alias for backward compatibility) */
export const getUsers = () => {
  return API.get("/admin/users");
};

/* 📌 DELETE USER */
export const deleteUser = (id) => {
  return API.delete(`/admin/users/${id}`);
};