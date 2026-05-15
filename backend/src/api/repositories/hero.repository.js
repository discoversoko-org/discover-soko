const HeroSlide = require("../../models/HeroSlide");

/* 📌 Get all slides (admin) */
const findAllSlides = () => {
  return HeroSlide.find()
    .sort({ createdAt: -1 })
    .lean();
};

/* 📌 Get active slides (public) */
const findActiveSlides = () => {
  return HeroSlide.find({ isActive: true })
    .sort({ createdAt: -1 })
    .lean();
};

/* 📌 Find slide by ID */
const findSlideById = (id) => {
  return HeroSlide.findById(id);
};

/* 📌 Create slide */
const createSlide = (data) => {
  return HeroSlide.create({
    title: data.title,
    tag: data.tag || "",
    description: data.description || "",   // ✅ ensure support
    whatsapp: data.whatsapp || "",         // ✅ ensure support
    linkText: data.linkText || "View",
    link: data.link || "",
    image: data.image,
    isActive:
      typeof data.isActive === "boolean"
        ? data.isActive
        : true,
  });
};

/* 📌 Update slide */
const updateSlideById = (id, data) => {
  return HeroSlide.findByIdAndUpdate(
    id,
    {
      $set: {
        title: data.title,
        tag: data.tag,
        description: data.description,
        whatsapp: data.whatsapp,
        linkText: data.linkText,
        link: data.link,
        isActive: data.isActive,
        image: data.image,
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );
};

/* 📌 Delete slide */
const deleteSlideById = (id) => {
  return HeroSlide.findByIdAndDelete(id);
};

module.exports = {
  findAllSlides,
  findActiveSlides,
  findSlideById,
  createSlide,
  updateSlideById,
  deleteSlideById,
};