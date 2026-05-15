import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getAllSlides,
  createSlide,
  updateSlide,
  deleteSlide,
} from "../../api/hero.api";

import "../../styles/HeroSlideDashboard.css";

export default function HeroSlides() {
  const navigate = useNavigate();

  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingSlide, setEditingSlide] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    whatsapp: "",
    isActive: true,
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    fetchSlides();
  }, []);

  /* =========================================
     FETCH
  ========================================= */
  const fetchSlides = async () => {
    try {
      const res = await getAllSlides();

      const data =
        res.data?.data ||
        res.data?.slides ||
        res.data ||
        [];

      setSlides(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setSlides([]);
    } finally {
      setLoading(false);
    }
  };

  /* =========================================
     SUBMIT
  ========================================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const fd = new FormData();

      fd.append("title", formData.title);
      fd.append("description", formData.description);
      fd.append("whatsapp", formData.whatsapp);
      fd.append("isActive", formData.isActive ? "true" : "false");

      if (image) {
        fd.append("image", image);
      }

      if (editingSlide) {
        await updateSlide(editingSlide._id, fd);
      } else {
        await createSlide(fd);
      }

      await fetchSlides();
      resetForm();
    } catch (err) {
      console.error(err);
    }
  };

  /* =========================================
     EDIT
  ========================================= */
  const handleEdit = (slide) => {
    setEditingSlide(slide);

    setFormData({
      title: slide.title || "",
      description: slide.description || "",
      whatsapp: slide.whatsapp || "",
      isActive: slide.isActive ?? true,
    });

    setPreview(slide.image?.url || "");
    setShowForm(true);
  };

  /* =========================================
     DELETE
  ========================================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this slide?")) return;

    try {
      await deleteSlide(id);

      setSlides((prev) =>
        prev.filter((s) => s._id !== id)
      );
    } catch (err) {
      console.error(err);
    }
  };

  /* =========================================
     RESET
  ========================================= */
  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      whatsapp: "",
      isActive: true,
    });

    setImage(null);
    setPreview("");
    setEditingSlide(null);
    setShowForm(false);
  };

  /* =========================================
     CHANGE
  ========================================= */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((p) => ({
      ...p,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /* =========================================
     IMAGE
  ========================================= */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  /* =========================================
     LOADING
  ========================================= */
  if (loading) {
    return (
      <div className="hero-loading">
        Loading slides...
      </div>
    );
  }

  return (
    <div className="hero-admin">

      {/* CLOSE */}
      <button
        className="hero-close"
        onClick={() => navigate("/")}
      >
        ×
      </button>

      {/* TOPBAR */}
      <div className="hero-topbar">
        <div>
          <h1>Hero Slides</h1>
          <p>Admin dashboard</p>
        </div>

        <button
          className="hero-add-btn"
          onClick={() => setShowForm((p) => !p)}
        >
          {showForm ? "Close Form" : "+ Add Slide"}
        </button>
      </div>

      {/* FORM */}
      {showForm && (
        <div className="hero-form-card">
          <h2>
            {editingSlide ? "Edit Slide" : "Create Slide"}
          </h2>

          <form onSubmit={handleSubmit} className="hero-form">

            {/* IMAGE */}
            {preview ? (
              <div className="hero-preview-wrapper">
                <img
                  src={preview}
                  className="preview-image"
                  alt="preview"
                />

                <label className="hero-upload-btn">
                  Upload Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
            ) : (
              <label className="hero-upload-btn hero-upload-btn--standalone">
                Upload Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
            )}

            {/* TITLE */}
            <input
              name="title"
              placeholder="Title"
              value={formData.title}
              onChange={handleChange}
              required
            />

            {/* DESCRIPTION */}
            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              rows="5"
            />

            {/* WHATSAPP */}
            <input
              name="whatsapp"
              placeholder="WhatsApp / Contact"
              value={formData.whatsapp}
              onChange={handleChange}
            />

            {/* ACTIVE */}
            <label className="hero-checkbox">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
              />
              <span>Active</span>
            </label>

            {/* ACTIONS */}
            <div className="hero-form-actions">
              <button type="submit" className="hero-submit-btn">
                {editingSlide ? "Update Slide" : "Create Slide"}
              </button>

              <button
                type="button"
                onClick={resetForm}
                className="hero-cancel-btn"
              >
                Cancel
              </button>
            </div>

          </form>
        </div>
      )}

      {/* GRID */}
      <div className="hero-slides-grid">
        {slides.map((slide) => {

          const contact = slide.whatsapp || "";

          return (
            <div key={slide._id} className="hero-slide-card">

              {/* IMAGE */}
              <img
                src={slide?.image?.url || "/placeholder.png"}
                alt={slide?.title || "slide"}
                className="hero-slide-image"
              />

              {/* CONTENT */}
              <div className="hero-slide-content">

                {/* TITLE */}
                <h3 className="hero-slide-title">
                  {slide?.title || "No Title"}
                </h3>

                {/* DESCRIPTION */}
                <p className="hero-slide-description">
                  {slide?.description || "No description added"}
                </p>

                {/* CONTACT */}
                <div className="hero-slide-contact-wrapper">
                  <span className="hero-slide-contact-label">
                    Contact
                  </span>

                  {contact ? (
                    <a
                      href={`https://wa.me/${contact.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="hero-slide-whatsapp"
                    >
                      {contact}
                    </a>
                  ) : (
                    <p className="hero-slide-description">
                      No contact added
                    </p>
                  )}
                </div>

                {/* STATUS */}
                <div className="hero-slide-status">
                  <span
                    className={`hero-status-badge ${
                      slide?.isActive
                        ? "hero-status-active"
                        : "hero-status-inactive"
                    }`}
                  >
                    {slide?.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

              </div>

              {/* ACTIONS */}
              <div className="hero-card-actions">
                <button
                  className="hero-edit-btn"
                  onClick={() => handleEdit(slide)}
                >
                  Edit
                </button>

                <button
                  className="hero-delete-btn"
                  onClick={() => handleDelete(slide._id)}
                >
                  Delete
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}