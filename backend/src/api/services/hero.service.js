const heroRepository = require("../repositories/hero.repository");
const cloudinary = require("../../config/cloudinary");

/* 📌 Get all slides (admin) */
const getAllSlides = () => {
  return heroRepository.findAllSlides();
};

/* 📌 Get active slides (public) */
const getActiveSlides = () => {
  return heroRepository.findActiveSlides();
};

/* 📌 Create slide */
const createSlide = async ({
  title,
  tag,
  description,
  whatsapp,
  linkText,
  link,
  file,
}) => {
  if (!title || !file) {
    throw { status: 400, message: "Title and image are required" };
  }

  return heroRepository.createSlide({
    title: title.trim(),
    tag: tag?.trim() || "",
    description: description?.trim() || "",   // ✅ FIX
    whatsapp: whatsapp?.trim() || "",         // ✅ FIX
    linkText: linkText?.trim() || "View",
    link: link?.trim() || "",
    image: {
      url: file.path,
      public_id: file.filename || "",
    },
    isActive: true,
  });
};

/* 📌 Update slide */
const updateSlide = async ({ id, body, file }) => {
  const slide = await heroRepository.findSlideById(id);

  if (!slide) {
    throw { status: 404, message: "Slide not found" };
  }

  // 🧹 Delete old image if new one is uploaded
  if (file && slide.image?.public_id) {
    try {
      await cloudinary.uploader.destroy(slide.image.public_id);
    } catch (err) {
      console.error("Cloudinary delete failed:", err.message);
    }
  }

  const updateData = {
    title: body.title ? body.title.trim() : slide.title,
    tag: body.tag ? body.tag.trim() : slide.tag,
    description: body.description
      ? body.description.trim()
      : slide.description || "",
    whatsapp: body.whatsapp
      ? body.whatsapp.trim()
      : slide.whatsapp || "",
    linkText: body.linkText ? body.linkText.trim() : slide.linkText,
    link: body.link ? body.link.trim() : slide.link,
    isActive:
      typeof body.isActive === "boolean"
        ? body.isActive
        : slide.isActive,
  };

  // 🖼️ Update image if provided
  if (file) {
    updateData.image = {
      url: file.path,
      public_id: file.filename || "",
    };
  }

  return heroRepository.updateSlideById(id, updateData);
};

/* 📌 Delete slide */
const deleteSlide = async (id) => {
  const slide = await heroRepository.findSlideById(id);

  if (!slide) {
    throw { status: 404, message: "Slide not found" };
  }

  if (slide.image?.public_id) {
    try {
      await cloudinary.uploader.destroy(slide.image.public_id);
    } catch (err) {
      console.error("Cloudinary delete failed:", err.message);
    }
  }

  await heroRepository.deleteSlideById(id);
};

module.exports = {
  getAllSlides,
  getActiveSlides,
  createSlide,
  updateSlide,
  deleteSlide,
};