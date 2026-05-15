const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

/* =========================
   📏 FILE SIZE LIMITS
========================= */
const FILE_SIZES = {
  avatar: 5 * 1024 * 1024,          // 5MB
  businessImage: 10 * 1024 * 1024,  // 10MB
  document: 20 * 1024 * 1024,       // 20MB
};

/* =========================
   📂 ALLOWED FORMATS
========================= */
const ALLOWED_FORMATS = {
  image: ["jpg", "jpeg", "png", "gif", "webp"],
  document: ["pdf", "doc", "docx", "xls", "xlsx"],
  avatar: ["jpg", "jpeg", "png"],
};

/* =========================
   ☁️ CLOUDINARY STORAGE
========================= */
const createStorage = (folder, formats) => {
  return new CloudinaryStorage({
    cloudinary,
    params: {
      folder: `business-app/${folder}`,
      allowed_formats: formats,
      resource_type: "auto",
    },
  });
};

/* =========================
   🔍 FILE FILTER
========================= */
const fileFilter = (formats) => (req, file, cb) => {
  const ext = file.originalname.split(".").pop()?.toLowerCase();

  if (!ext || !formats.includes(ext)) {
    return cb({
      status: 400,
      message: `Only ${formats.join(", ")} files are allowed`,
    });
  }

  cb(null, true);
};

/* =========================
   🏗️ UPLOAD FACTORY
========================= */
const createUpload = (folder, formats, sizeLimit) => {
  return multer({
    storage: createStorage(folder, formats),
    limits: { fileSize: sizeLimit },
    fileFilter: fileFilter(formats),
  });
};

/* =========================
   👤 PROFILE UPLOAD (🔥 MAIN FIX)
   Handles BOTH:
   - avatar file
   - name/email (req.body)
========================= */
const uploadProfile = createUpload(
  "avatars",
  ALLOWED_FORMATS.avatar,
  FILE_SIZES.avatar
);

/* =========================
   📤 EXPORTS
========================= */
module.exports = {
  /* 👤 Avatar ONLY (legacy) */
  uploadAvatar: createUpload(
    "avatars",
    ALLOWED_FORMATS.avatar,
    FILE_SIZES.avatar
  ),

  /* 🔥 PROFILE (avatar + text fields) */
  uploadProfile,

  /* 🏢 Business Images */
  uploadBusinessImage: createUpload(
    "businesses",
    ALLOWED_FORMATS.image,
    FILE_SIZES.businessImage
  ),

  /* 📄 Documents */
  uploadDocument: createUpload(
    "documents",
    ALLOWED_FORMATS.document,
    FILE_SIZES.document
  ),

  /* 🖼️ Generic Images */
  uploadImage: createUpload(
    "images",
    ALLOWED_FORMATS.image,
    FILE_SIZES.businessImage
  ),

  /* ⚙️ Simple single upload (fallback) */
  single: (fieldName) => {
    return multer({
      storage: createStorage("avatars", ALLOWED_FORMATS.avatar),
      limits: { fileSize: FILE_SIZES.avatar },
      fileFilter: fileFilter(ALLOWED_FORMATS.avatar),
    }).single(fieldName);
  },

  /* 🧩 Optional upload (safe for mixed JSON/form routes) */
  optionalSingle: (uploadMiddleware, fieldName) => {
    return (req, res, next) => {
      if (!req.is("multipart/form-data")) {
        return next();
      }

      uploadMiddleware.single(fieldName)(req, res, (err) => {
        if (err) return next(err);
        next();
      });
    };
  },
};