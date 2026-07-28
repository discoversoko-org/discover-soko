// src/middleware/upload.middleware.js

const fs = require(
  "fs"
);

const path = require(
  "path"
);

const multer = require(
  "multer"
);

const ApiError = require(
  "../shared/utils/ApiError"
);

/* =========================================
   UPLOAD DIRECTORY
========================================= */

const uploadDir =
  path.join(
    process.cwd(),
    "uploads"
  );

if (
  !fs.existsSync(
    uploadDir
  )
) {
  fs.mkdirSync(
    uploadDir,
    {
      recursive: true,
    }
  );
}

/* =========================================
   STORAGE CONFIGURATION
========================================= */

const storage =
  multer.diskStorage({
    destination:
      (
        _req,
        _file,
        callback
      ) => {
        callback(
          null,
          uploadDir
        );
      },

    filename:
      (
        _req,
        file,
        callback
      ) => {
        const extension =
          path.extname(
            file.originalname
          );

        const uniqueName =
          `${Date.now()}-${Math.round(
            Math.random() *
              1e9
          )}${extension}`;

        callback(
          null,
          uniqueName
        );
      },
  });

/* =========================================
   ALLOWED MIME TYPES
========================================= */

const allowedMimeTypes =
  [
    "image/jpeg",
    "image/png",
    "image/webp",
  ];

/* =========================================
   FILE FILTER
========================================= */

const fileFilter = (
  _req,
  file,
  callback
) => {
  if (
    allowedMimeTypes.includes(
      file.mimetype
    )
  ) {
    return callback(
      null,
      true
    );
  }

  return callback(
    new ApiError(
      400,
      "Invalid file type. Only JPEG, PNG, and WEBP are allowed."
    ),
    false
  );
};

/* =========================================
   MULTER INSTANCE
========================================= */

const upload = multer({
  storage,

  fileFilter,

  limits: {
    fileSize:
      5 *
      1024 *
      1024,

    files: 5,
  },
});

/* =========================================
   EXPORT
========================================= */

module.exports =
  upload;