import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getUserProfile, updateProfile } from "../../api/user.api";

import "../../styles/Profile.css";

export default function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const fileRef = useRef(null);

  const [form, setForm] = useState({
    name: "",
  });

  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(null);

  /* =========================
     FETCH PROFILE
  ========================= */
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);

      const res = await getUserProfile();

      const currentUser =
        res.data?.data?.user ||
        res.data?.data ||
        res.data;

      setUser(currentUser);

      setForm({
        name: currentUser?.name || "",
      });

      const avatarUrl =
        currentUser?.avatar?.url ||
        currentUser?.avatar ||
        null;

      if (avatarUrl) {
        setPreview(`${avatarUrl}?t=${Date.now()}`);
      } else {
        setPreview(null);
      }
    } catch (err) {
      console.error("PROFILE ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     OPEN EDIT
  ========================= */
  const handleAvatarClick = () => {
    setEditMode(true);
  };

  /* =========================
     IMAGE CHANGE
  ========================= */
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setAvatar(file);
    setPreview(URL.createObjectURL(file));
  };

  /* =========================
     SAVE PROFILE
  ========================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const data = new FormData();

      data.append("name", form.name);

      if (avatar) {
        data.append("avatar", avatar);
      }

      const res = await updateProfile(data);

      const updatedUser =
        res.data?.data?.user ||
        res.data?.data ||
        res.data;

      setUser(updatedUser);

      setForm({
        name: updatedUser?.name || "",
      });

      const updatedAvatar =
        updatedUser?.avatar?.url ||
        updatedUser?.avatar;

      if (updatedAvatar) {
        const freshAvatar =
          `${updatedAvatar}?t=${Date.now()}`;

        setPreview(freshAvatar);

        localStorage.setItem(
          "profile_updated",
          Date.now()
        );

        window.dispatchEvent(
          new Event("profileUpdated")
        );
      }

      setAvatar(null);
      setEditMode(false);

    } catch (err) {
      console.error("UPDATE ERROR:", err);
    } finally {
      setSaving(false);
    }
  };

  /* =========================
     INITIALS
  ========================= */
  const getInitials = (name = "") => {
    return name
      .split(" ")
      .slice(0, 2)
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  /* =========================
     LOADING
  ========================= */
  if (loading) {
    return (
      <div className="profile-loading">
        Loading profile...
      </div>
    );
  }

  return (
    <>
      {/* =========================
          PROFILE CARD
      ========================= */}
      <div className="profile-ig">

        {/* CLOSE */}
        <button
          className="profile-home-close"
          onClick={() => navigate("/")}
        >
          ×
        </button>

        {/* AVATAR */}
        <div className="profile-ig__left">
          {preview ? (
            <img
              src={preview}
              alt="profile"
              className="profile-ig__avatar"
              onClick={handleAvatarClick}
            />
          ) : (
            <div
              className="profile-ig__avatar profile-ig__placeholder"
              onClick={handleAvatarClick}
            >
              {getInitials(user?.name)}
            </div>
          )}
        </div>

        {/* CONTENT */}
        <div className="profile-ig__right">

          <h2 className="profile-ig__name">
            {user?.name || "No Name"}
          </h2>

          <p className="profile-ig__email">
            {user?.email || "No Email"}
          </p>

        </div>
      </div>

      {/* =========================
          EDIT MODAL
      ========================= */}
      {editMode && (
        <div
          className="profile-overlay"
          onClick={() => setEditMode(false)}
        >
          <div
            className="profile-card"
            onClick={(e) => e.stopPropagation()}
          >

            <button
              className="profile-close"
              onClick={() => setEditMode(false)}
            >
              ×
            </button>

            <h2>Edit Profile</h2>

            <div className="avatar-wrapper">

              {preview ? (
                <img
                  src={preview}
                  alt="avatar"
                  className="profile-avatar"
                  onClick={() =>
                    fileRef.current.click()
                  }
                />
              ) : (
                <div
                  className="avatar-placeholder"
                  onClick={() =>
                    fileRef.current.click()
                  }
                >
                  {getInitials(form.name)}
                </div>
              )}

              <input
                type="file"
                ref={fileRef}
                hidden
                accept="image/*"
                onChange={handleImageChange}
              />

              <p className="avatar-text">
                Click to change avatar
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="profile-form"
            >

              <div className="profile-group">
                

                <input
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="profile-btn"
              >
                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>

            </form>

            <button
              className="cancel-btn"
              onClick={() => setEditMode(false)}
            >
              Cancel
            </button>

          </div>
        </div>
      )}
    </>
  );
}