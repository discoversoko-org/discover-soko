const asyncHandler = require("../../utils/asyncHandler");
const { sendResponse } = require("../../utils/sendResponse");
const heroService = require("../services/hero.service");

const {
  validateHeroSlide,
  validateHeroSlideUpdate,
} = require("../validations/hero.validation");

/* =========================
   🌍 PUBLIC: ACTIVE SLIDES
========================= */
exports.getActiveSlides = asyncHandler(async (req, res) => {
  const slides = await heroService.getActiveSlides();

  return sendResponse(
    res,
    200,
    slides,
    "Active slides retrieved"
  );
});

/* =========================
   🔐 ADMIN: GET ALL SLIDES
========================= */
exports.getAllSlidesAdmin = asyncHandler(async (req, res) => {
  const slides = await heroService.getAllSlides();

  return sendResponse(
    res,
    200,
    slides,
    "All slides retrieved (admin)"
  );
});

/* =========================
   ➕ CREATE SLIDE (ADMIN)
========================= */
exports.createSlide = asyncHandler(async (req, res) => {

  // ✅ FIX BOOLEAN
  if (req.body.isActive !== undefined) {
    req.body.isActive =
      req.body.isActive === true ||
      req.body.isActive === "true";
  }

  // ✅ FIX NUMBER
  if (req.body.order !== undefined) {
    req.body.order = Number(req.body.order);
  }

  const validation = validateHeroSlide({
    ...req.body,
    image: req.file ? { url: req.file.path } : null,
  });

  if (!validation.isValid) {
    return sendResponse(
      res,
      400,
      null,
      validation.errors?.[0] || "Validation failed"
    );
  }

  const slide = await heroService.createSlide({
    title: req.body.title,
    description: req.body.description,
    whatsapp: req.body.whatsapp,   // ✅ FIX ADDED
    order: req.body.order,
    isActive: req.body.isActive,
    file: req.file,
  });

  return sendResponse(
    res,
    201,
    slide,
    "Slide created successfully"
  );
});

/* =========================
   ✏️ UPDATE SLIDE (ADMIN)
========================= */
exports.updateSlide = asyncHandler(async (req, res) => {

  // ✅ FIX BOOLEAN
  if (req.body.isActive !== undefined) {
    req.body.isActive =
      req.body.isActive === true ||
      req.body.isActive === "true";
  }

  // ✅ FIX NUMBER
  if (req.body.order !== undefined) {
    req.body.order = Number(req.body.order);
  }

  const validation = validateHeroSlideUpdate({
    ...req.body,
    image: req.file ? { url: req.file.path } : undefined,
  });

  if (!validation.isValid) {
    return sendResponse(
      res,
      400,
      null,
      validation.errors?.[0] || "Validation failed"
    );
  }

  const slide = await heroService.updateSlide({
    id: req.params.id,
    body: {
      title: req.body.title,
      description: req.body.description,
      whatsapp: req.body.whatsapp,   // ✅ FIX ADDED
      order: req.body.order,
      isActive: req.body.isActive,
    },
    file: req.file,
  });

  return sendResponse(
    res,
    200,
    slide,
    "Slide updated successfully"
  );
});

/* =========================
   🗑 DELETE SLIDE (ADMIN)
========================= */
exports.deleteSlide = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await heroService.deleteSlide(id);

  return sendResponse(
    res,
    200,
    null,
    "Slide deleted successfully"
  );
});