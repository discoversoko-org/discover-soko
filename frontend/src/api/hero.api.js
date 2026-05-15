import API from "./axios";


/* =========================
   🌍 PUBLIC: ACTIVE SLIDES
========================= */
export const getActiveSlides = () => {
  return API.get("/hero");
};


/* =========================
   🔐 ADMIN: ALL SLIDES
========================= */
export const getAllSlides = () => {
  return API.get("/hero/admin");
};


/* =========================
   ➕ CREATE SLIDE (ADMIN)
========================= */
export const createSlide = (formData) => {
  return API.post("/hero/admin", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};


/* =========================
   ✏️ UPDATE SLIDE (ADMIN)
========================= */
export const updateSlide = (id, formData) => {
  return API.put(`/hero/admin/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};


/* =========================
   🗑 DELETE SLIDE (ADMIN)
========================= */
export const deleteSlide = (id) => {
  return API.delete(`/hero/admin/${id}`);
};