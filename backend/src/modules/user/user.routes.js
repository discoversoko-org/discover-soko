// src/modules/user/user.routes.js

const express = require(
  "express"
);

const router =
  express.Router();

/* =========================================
   MIDDLEWARE
========================================= */

const authMiddleware =
  require(
    "../../middleware/auth.middleware"
  );

const {
  uploadAvatar,
} = require(
  "../../middleware/upload.middleware"
);

/* =========================================
   CONTROLLER
========================================= */

const {
  getMe,
  updateProfile,
  changePassword,
  deleteAccount,
} = require(
  "./user.controller"
);

/* =========================================
   PROFILE
========================================= */

router.get(
  "/me",
  authMiddleware,
  getMe
);

router.put(
  "/profile",
  authMiddleware,

  // SAFE CHECK
  uploadAvatar
    ? uploadAvatar.single(
        "avatar"
      )
    : (req, res, next) =>
        next(),

  updateProfile
);

/* =========================================
   PASSWORD
========================================= */

router.patch(
  "/change-password",
  authMiddleware,
  changePassword
);

/* =========================================
   ACCOUNT
========================================= */

router.delete(
  "/delete-account",
  authMiddleware,
  deleteAccount
);

module.exports =
  router;