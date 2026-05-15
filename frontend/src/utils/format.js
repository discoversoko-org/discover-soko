import { format, parseISO } from "date-fns";

/* FORMAT DATE */
export const formatDate = (date) => {
  if (!date) return "";
  return format(parseISO(date), "dd MMM yyyy");
};

/* FORMAT CURRENCY (KES default) */
export const formatCurrency = (amount, currency = "KES") => {
  if (amount === null || amount === undefined) return "";

  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency,
  }).format(amount);
};

/* TRUNCATE TEXT */
export const truncateText = (text, max = 100) => {
  if (!text) return "";
  return text.length > max ? text.slice(0, max) + "..." : text;
};

/* CAPITALIZE FIRST LETTER */
export const capitalize = (text) => {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
};

/* FORMAT PHONE (basic MVP) */
export const formatPhone = (phone) => {
  if (!phone) return "";
  return phone.replace(/\D/g, "");
};