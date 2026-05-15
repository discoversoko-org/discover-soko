const asyncHandler = require("../../utils/asyncHandler");
const { sendResponse } = require("../../utils/sendResponse");
const authService = require("../services/auth.service");

const { validateRegister } = require("../validations/auth.validation");

/* 📌 REGISTER */
exports.register = asyncHandler(async (req, res) => {
  validateRegister(req.body);

  const { user, token } = await authService.register({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    filePath: req.file?.path,
  });

  sendResponse(res, 201, { token, user }, "User registered successfully");
});

/* 📌 LOGIN */
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw { status: 400, message: "Email and password are required" };
  }

  const { user, token } = await authService.login({ email, password });

  sendResponse(res, 200, { token, user }, "Login successful");
});