// utils/formatPhone.js

export function formatPhone(countryCode, phone) {
  const cleaned = phone.replace(/\D/g, "");

  return `${countryCode}${cleaned}`;
}