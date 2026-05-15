const rateLimit = require("express-rate-limit");

// Strict for login (prevent brute force)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50, // increased to 50 attempts for development
  message: {
    message: "Too many login attempts, try again later",
  },
});

// Reviews limiter (prevent spam)
const reviewLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 20, // 20 reviews/actions per 10 mins
  message: {
    message: "Too many review actions, slow down",
  },
});

//  General API
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

module.exports = {
  apiLimiter,
  authLimiter,
  reviewLimiter,
};