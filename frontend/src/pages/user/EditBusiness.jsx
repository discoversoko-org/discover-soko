import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getBusinessById, updateBusiness } from "../../api/business.api";
import "../../styles/EditBusiness.css";

export default function EditBusiness() {
  const navigate = useNavigate();
  const { id } = useParams();
  const fileRef = useRef(null);

  const [business, setBusiness] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    category: "",
    contact: "",
    description: "",
  });

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    fetchBusiness();
  }, [id]);

  /* 🧠 cleanup preview URL */
  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const fetchBusiness = async () => {
    try {
      const res = await getBusinessById(id);
      const biz = res.data?.data || res.data;

      setBusiness(biz);

      setFormData({
        name: biz.name || "",
        location: biz.location || "",
        category: biz.category || "",
        contact: biz.contact || "",
        description: biz.description || "",
      });

    } catch (err) {
      console.error("❌ Fetch error:", err);
    } finally {
      setFetchLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImage(file);

    if (imagePreview) URL.revokeObjectURL(imagePreview);

    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const form = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        form.append(key, value);
      });

      if (image) {
        form.append("image", image);
      }

      await updateBusiness(id, form);

      // ✅ FIXED ROUTE (THIS WAS YOUR MAIN ISSUE)
      navigate("/user/dashboard", {
        replace: true,
        state: { refresh: Date.now() },
      });

    } catch (err) {
      console.error("❌ Update error:", err);
      alert(err?.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/user/dashboard"); // ✅ consistent
  };

  if (fetchLoading || !business) {
    return <div className="edit-loading">Loading business...</div>;
  }

  return (
    <div className="edit-business">
      <div className="edit-card">

        {/* CLOSE */}

       {/*  <button
          className="edit-close"
          onClick={handleCancel}
          type="button"
        >
          ✕
        </button> */}

        

        <form onSubmit={handleSubmit}>

          {/* IMAGE */}
          <div className="image-wrapper">
            <img
              src={imagePreview || business.image?.url || "/placeholder.jpg"}
              alt="business"
              className="image-preview"
            />

            <button
              type="button"
              className="image-btn"
              onClick={() => fileRef.current.click()}
            >
              Change Image
            </button>

            <input
              type="file"
              ref={fileRef}
              accept="image/*"
              hidden
              onChange={handleImageChange}
            />
          </div>

          {/* FORM */}
          <div className="form-grid">

            <div className="form-group">
              {/* <label>Business Name</label> */}
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              {/* <label>Location</label> */}
              <input
                name="location"
                value={formData.location}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              {/* <label>Category</label> */}
              <input
                name="category"
                value={formData.category}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              {/* <label>Contact</label> */}
              <input
                name="contact"
                value={formData.contact}
                onChange={handleChange}
              />
            </div>

          </div>

          <div className="form-group full">
            {/* <label>Description</label> */}
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
            />
          </div>

          {/* ACTIONS */}
          <div className="form-actions">

            <button
              type="button"
              className="btn cancel"
              onClick={handleCancel}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn primary"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update "}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}