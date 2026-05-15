import { Link } from "react-router-dom";
import { useState } from "react";

import "../../styles/BusinessCard.css";

const BusinessCard = ({ business }) => {
  const owner = business?.owner;

  /* =========================================
     SAFE AVATAR
  ========================================= */

  const avatarUrl =
    owner?.avatar?.url ||
    owner?.avatar ||
    "";

  const [avatarError, setAvatarError] =
    useState(false);

  const showAvatar =
    avatarUrl && !avatarError;

  return (
    <div className="business-card">

      {/* USER */}
      <div className="business-card__user">

        {showAvatar ? (
          <img
            src={avatarUrl}
            alt="user"
            className="business-card__avatar"
            loading="lazy"
            onError={() => {
              setAvatarError(true);
            }}
          />
        ) : (
          <div className="business-card__avatar-fallback">
            {owner?.name
              ?.charAt(0)
              ?.toUpperCase() || "U"}
          </div>
        )}

        <span className="business-card__username">
          {owner?.name ||
            "Unknown user"}
        </span>

      </div>

      {/* IMAGE */}
      <div className="business-card__image-wrapper">

        <img
          src={
            business?.image?.url ||
            "/placeholder.jpg"
          }
          alt={business?.name}
          className="business-card__image"
        />

      </div>

      {/* CONTENT */}
      <div className="business-card__content">

        <h3 className="business-card__title">
          {business?.name}
        </h3>

        <p className="business-card__description">
          {business?.description}
        </p>

        <Link
          to={`/business/${business?._id}`}
          className="business-card__link"
        >
          View More
        </Link>

      </div>

    </div>
  );
};

export default BusinessCard;