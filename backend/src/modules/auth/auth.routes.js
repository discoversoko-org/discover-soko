// src/modules/auth/auth.routes.js

const express = require("express");

const router = express.Router();

const authController = require("./auth.controller");
const authMiddleware = require("../../middleware/auth.middleware");
const roleMiddleware = require("../../middleware/role.middleware");

const { ROLES } = require("../../shared/constants/roles");

router.post("/register/send-otp", authController.sendCustomerSignupOTP);
router.post("/register/verify-otp", authController.verifyCustomerSignupOTP);
router.post("/register/complete", authController.completeCustomerSignup);

router.post("/customer/send-otp", authController.sendCustomerSignupOTP);
router.post("/customer/verify-otp", authController.verifyCustomerSignupOTP);
router.post("/customer/complete-profile", authController.completeCustomerSignup);
router.post("/register", authController.register);
router.post("/verify-registration-otp", authController.verifyRegistrationOTP);
router.post("/resend-registration-otp", authController.resendRegistrationOTP);
router.post("/login", authController.login);
router.post("/admin/login", authController.adminLogin);

router.post("/refresh-token", authController.refreshToken);
router.post("/logout", authMiddleware, authController.logout);
router.post("/revoke-sessions", authMiddleware, authController.revokeAllSessions);

router.post("/forgot-password", authController.forgotPassword);
router.post("/verify-reset-code", authController.verifyResetCode);
router.post("/reset-password", authController.resetPassword);
router.post("/change-password", authMiddleware, authController.changePassword);

router.get("/me", authMiddleware, authController.getMe);
router.post("/select-role", authMiddleware, roleMiddleware(ROLES.ADMIN), authController.selectRole);

module.exports = router;
