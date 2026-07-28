// utils/validators.js

export function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePassword(password) {
  return password.length >= 8;
}

export function validatePhone(phone) {
  return /^\d{9,12}$/.test(phone);
}

export function validateOTP(otp) {
  return otp.length === 4;
}