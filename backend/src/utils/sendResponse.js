/**
 * Standardized Response Formatter
 * Ensures consistent API structure across backend
 */

const sendResponse = (res, statusCode, data, message = "Success") => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

module.exports = { sendResponse };