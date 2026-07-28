// src/modules/otp/otp.service.js

const crypto = require("crypto");

const otpRepository = require("./otp.repository");
const { generateOTP, getOTPExpiryTime } = require("./otp.utils");
const { OTP_EXPIRY_MINUTES, OTP_MAX_ATTEMPTS } = require("./otp.constants");

const hashCode = (code) => {
  return crypto.createHash("sha256").update(String(code).trim()).digest("hex");
};

const createOTP = async ({ userId, email, phoneNumber, purpose, method, ipAddress, userAgent }) => {
  await otpRepository.deleteOTP({
    email,
    phoneNumber,
    purpose,
  });

  const code = generateOTP();
  const codeHash = hashCode(code);

  const otp = await otpRepository.createOTP({
    userId,
    email,
    phoneNumber,
    codeHash,
    purpose,
    method,
    ipAddress: ipAddress || null,
    userAgent: userAgent || null,
    expiresAt: getOTPExpiryTime(OTP_EXPIRY_MINUTES),
    attempts: 0,
  });

  return {
    otp,
    code,
  };
};

const verifyOTP = async ({ email, phoneNumber, code, purpose }) => {
  const codeHash = hashCode(code);

  const otp = await otpRepository.findOTP({
    email,
    phoneNumber,
    codeHash,
    purpose,
  });

  if (!otp) {
    throw { status: 400, message: "Invalid OTP code" };
  }

  if (otp.attempts >= OTP_MAX_ATTEMPTS || otp.maxAttempts <= otp.attempts) {
    throw { status: 429, message: "Maximum OTP attempts exceeded" };
  }

  if (new Date() > otp.expiresAt) {
    throw { status: 400, message: "OTP has expired" };
  }

  await otpRepository.markOTPAsUsed(otp._id);

  return { success: true, otp };
};

const findVerifiedOTP = async ({ email, phoneNumber, purpose }) => {
  return otpRepository.findVerifiedOTP({
    email,
    phoneNumber,
    purpose,
  });
};

const deleteOTP = async ({ email, phoneNumber, purpose }) => {
  return otpRepository.deleteOTP({
    email,
    phoneNumber,
    purpose,
  });
};

module.exports = {
  createOTP,
  verifyOTP,
  findVerifiedOTP,
  deleteOTP,
};
