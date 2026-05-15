import { useEffect, useState, useRef, useMemo } from "react";
import "../../styles/HeroSlider.css";

export default function HeroSlider({ slides = [] }) {
  const [index, setIndex] = useState(0);
  const intervalRef = useRef(null);

  /* =========================================
     ACTIVE SLIDES
  ========================================= */
  const activeSlides = useMemo(() => {
    return slides.filter((s) => s?.isActive);
  }, [slides]);

  const length = activeSlides.length;

  /* =========================================
     AUTO SLIDE
  ========================================= */
  useEffect(() => {
    if (!length) return;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % length);
    }, 5000);

    return () => clearInterval(intervalRef.current);
  }, [length]);

  /* =========================================
     RESET INDEX
  ========================================= */
  useEffect(() => {
    setIndex(0);
  }, [length]);

  if (!length) return null;

  const slide = activeSlides[index];

  /* =========================================
     SAFE DATA
  ========================================= */
  const title = slide?.title || "";
  const description = slide?.description || "";
  const contact = slide?.whatsapp || "";

  /* =========================================
     WHATSAPP LINK
  ========================================= */
  let whatsappLink = "#";

  if (contact) {
    const isUrl =
      contact.startsWith("http://") ||
      contact.startsWith("https://");

    whatsappLink = isUrl
      ? contact
      : `https://wa.me/${contact.replace(/\D/g, "")}`;
  }

  return (
    <section className="hero-slider">

      <div className="hero-slider__wrapper">

        {/* IMAGE */}
        <div className="hero-slider__image-wrapper">
          <img
            src={slide?.image?.url || "/placeholder.jpg"}
            alt={title || "Hero"}
            className="hero-slider__image"
          />
        </div>

        {/* OVERLAY */}
        <div className="hero-slider__dark-overlay" />

        {/* CONTENT */}
        <div className="hero-slider__content">

          {/* TITLE */}
          {title && (
            <h1 className="hero-slider__title">
              {title}
            </h1>
          )}

          {/* DESCRIPTION */}
          {description && (
            <p className="hero-slider__description">
              {description}
            </p>
          )}

          {/* CONTACT BUTTON */}
          {contact && whatsappLink !== "#" && (
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="hero-slider__contact hero-slider__contact--link"
            >
              Chat {contact}
            </a>
          )}

        </div>

        {/* DOTS */}
        <div className="hero-slider__dots">
          {activeSlides.map((_, i) => (
            <span
              key={i}
              className={`hero-slider__dot ${
                index === i
                  ? "hero-slider__dot--active"
                  : ""
              }`}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>

      </div>

    </section>
  );
}