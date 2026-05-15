const express = require("express");
const router = express.Router();

const { register, login } = require("../controllers/auth.controller");
const { authLimiter } = require("../../middleware/ratelimit.middleware");


/* 📌 REGISTER */
router.post(
  "/register",
  authLimiter,
  register
);


/* 📌 LOGIN */
router.post(
  "/login",
  authLimiter,
  login
);

module.exports = router;