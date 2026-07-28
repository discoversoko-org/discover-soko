// src/modules/otp/otp.repository.js

const OTP = require("../../models/OTP");

const createOTP = async (payload) => {
  return OTP.create(payload);
};

const findOTP = async ({ email, phoneNumber, purpose, codeHash }) => {
  return OTP.findOne({
    ...(email && { email }),
    ...(phoneNumber && { phoneNumber }),
    ...(codeHash && { codeHash }),
    purpose,
    consumed: false,
    invalidated: false,
  });
};

const findVerifiedOTP = async ({ email, phoneNumber, purpose }) => {
  return OTP.findOne({
    ...(email && { email }),
    ...(phoneNumber && { phoneNumber }),
    purpose,
    verified: true,
    consumed: true,
    invalidated: false,
  });
};

const deleteOTP = async ({ email, phoneNumber, purpose }) => {
  return OTP.deleteMany({
    ...(email && { email }),
    ...(phoneNumber && { phoneNumber }),
    purpose,
  });
};

const incrementAttempts = async (otpId) => {
  return OTP.findByIdAndUpdate(
    otpId,
    {
      $inc: { attempts: 1 },
    },
    { new: true }
  );
};

const markOTPAsUsed = async (otpId) => {
  return OTP.findByIdAndUpdate(
    otpId,
    {
      consumed: true,
      consumedAt: new Date(),
      verified: true,
      verifiedAt: new Date(),
    },
    { new: true }
  );
};

module.exports = {
  createOTP,
  findOTP,
  findVerifiedOTP,
  deleteOTP,
  incrementAttempts,
  markOTPAsUsed,
};
