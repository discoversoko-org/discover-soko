import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createBusiness } from "../../api/business.api";
import "../../styles/CreateBusiness.css";

export default function CreateBusiness() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    category: "",
    description: "",
    contact: "",
  });

  const [activeField, setActiveField] = useState("");

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const [loading, setLoading] = useState(false);

  /* cleanup preview */
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const businessData = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        businessData.append(key, value);
      });

      if (image) {
        businessData.append("image", image);
      }

      await createBusiness(businessData);

      navigate("/user/dashboard", {
        replace: true,
        state: { refresh: Date.now() },
      });

    } catch (error) {
      console.error("Error creating business:", error);

      alert(
        error?.response?.data?.message ||
        "Failed to create business"
      );

    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setImage(file);

    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setPreview(URL.createObjectURL(file));
  };

  return (
    <div className="create">
      <div className="create__card">

        {/* CLOSE */}
        <button
          type="button"
          className="create__close"
          onClick={() => navigate("/user/dashboard")}
        >
          ×
        </button>

        

        <form
          onSubmit={handleSubmit}
          className="create__form"
        >

          {/* IMAGE */}
          <div className="create__imageWrapper">

            <img
              src={preview || "/placeholder.jpg"}
              
              className="create__imagePreview"
            />

            <label className="create__imageBtn">
              Upload image

              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageChange}
              />
            </label>

          </div>

          {/* GRID */}
          <div className="create__grid">

            {/* NAME */}
            <div className="create__group">

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onFocus={() => setActiveField("name")}
                onBlur={() => setActiveField("")}
                placeholder={
                  activeField === "name"
                    ? ""
                    : "Business Name"
                }
                required
              />

            </div>

            {/* LOCATION */}
            <div className="create__group">

              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                onFocus={() => setActiveField("location")}
                onBlur={() => setActiveField("")}
                placeholder={
                  activeField === "location"
                    ? ""
                    : "Location"
                }
                required
              />

            </div>

            {/* CATEGORY */}
            <div className="create__group">

              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                onFocus={() => setActiveField("category")}
                onBlur={() => setActiveField("")}
                placeholder={
                  activeField === "category"
                    ? ""
                    : "Category"
                }
                required
              />

            </div>

            {/* CONTACT */}
            <div className="create__group">

              <input
                type="text"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                onFocus={() => setActiveField("contact")}
                onBlur={() => setActiveField("")}
                placeholder={
                  activeField === "contact"
                    ? ""
                    : "Contact"
                }
              />

            </div>

          </div>

          {/* DESCRIPTION */}
          <div className="create__group">

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              onFocus={() => setActiveField("description")}
              onBlur={() => setActiveField("")}
              placeholder={
                activeField === "description"
                  ? ""
                  : "Description"
              }
              rows="4"
            />

          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            className="create__button"
            disabled={loading}
          >
            {loading
              ? "Creating..."
              : "Create Business"}
          </button>

        </form>
      </div>
    </div>
  );
}