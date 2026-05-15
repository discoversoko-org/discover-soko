import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import { getBusinessById } from "../../api/business.api";

import "../../styles/BusinessDetails.css";

export default function BusinessDetails() {
  const { id } = useParams();

  const [business, setBusiness] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [showImageModal, setShowImageModal] =
    useState(false);

  /* =========================================
     SAFE AVATAR
  ========================================= */

  const [avatarError, setAvatarError] =
    useState(false);

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const res =
          await getBusinessById(id);

        setBusiness(
          res.data?.data ||
            res.data
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBusiness();
  }, [id]);

  if (loading) {
    return (
      <div className="details-full">
        Loading...
      </div>
    );
  }

  if (!business) {
    return (
      <div className="details-full">
        Not found
      </div>
    );
  }

  const avatarUrl =
    business.owner?.avatar?.url ||
    business.owner?.avatar ||
    "";

  const showAvatar =
    avatarUrl && !avatarError;

  const whatsappLink = `https://wa.me/${business.contact?.replace(
    /\D/g,
    ""
  )}`;

  return (
    <>
      <div className="details-container">

        {/* BACK */}
        <Link
          to="/"
          className="details-back"
        >
          ✕
        </Link>

        {/* CARD */}
        <div className="details-card">

          {/* USER */}
          <div className="details-user">

            {showAvatar ? (
              <img
                src={avatarUrl}
                alt="user"
                className="details-avatar"
                loading="lazy"
                onError={() => {
                  setAvatarError(true);
                }}
              />
            ) : (
              <div className="details-avatar-fallback">
                {business.owner?.name
                  ?.charAt(0)
                  ?.toUpperCase() || "U"}
              </div>
            )}

            <div>

              <p className="details-username">
                {business.owner?.name}
              </p>

              <p className="details-email">
                {business.owner?.email}
              </p>

            </div>

          </div>

          {/* IMAGE */}
          <div className="details-image-wrapper">

            <img
              src={business.image?.url}
              alt={business.name}
              className="details-image"
              onClick={() =>
                setShowImageModal(true)
              }
            />

          </div>

          {/* CONTENT */}
          <div className="details-content">

            <h2>{business.name}</h2>

            <p className="details-description">
              {business.description}
            </p>

            <p className="details-location">
              {business.location}
            </p>

            <a
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="details-whatsapp"
            >
              Chat {business.contact || "on WhatsApp"}
            </a>

            
          </div>

        </div>

      </div>

      {/* IMAGE MODAL */}
      {showImageModal && (
        <div
          className="image-modal"
          onClick={() =>
            setShowImageModal(false)
          }
        >

          <button
            className="image-modal-close"
            onClick={() =>
              setShowImageModal(false)
            }
          >
            ✕
          </button>

          <img
            src={business.image?.url}
            alt={business.name}
            className="image-modal-img"
          />

        </div>
      )}
    </>
  );
}