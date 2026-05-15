/* Business Validation Helpers
 * Throw errors → handled by error.middleware
 */

const mongoose = require("mongoose");


/* 🏗️ Validate Create Business */
const validateCreateBusiness = (data) => {
  const { name, category, location } = data;

  if (!name || typeof name !== "string" || !name.trim()) {
    throw { status: 400, message: "Business name is required" };
  }

  if (!category || typeof category !== "string" || !category.trim()) {
    throw { status: 400, message: "Category is required" };
  }

  if (!location || typeof location !== "string" || !location.trim()) {
    throw { status: 400, message: "Location is required" };
  }
};


/* ✏️ Validate Update Business */
const validateUpdateBusiness = (data) => {
  // Remove undefined fields first
  const allowedFields = ["name", "category", "location", "description", "contact"];
  const keys = Object.keys(data).filter((key) => allowedFields.includes(key));

  if (keys.length === 0) {
    throw { status: 400, message: "No valid data provided for update" };
  }

  // Validate non-empty strings if provided
  if (data.name !== undefined && !data.name.trim()) {
    throw { status: 400, message: "Business name cannot be empty" };
  }

  if (data.category !== undefined && !data.category.trim()) {
    throw { status: 400, message: "Category cannot be empty" };
  }

  if (data.location !== undefined && !data.location.trim()) {
    throw { status: 400, message: "Location cannot be empty" };
  }
};


/* 🆔 Validate Mongo ID */
const validateObjectId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw { status: 400, message: "Invalid ID" };
  }
};


module.exports = {
  validateCreateBusiness,
  validateUpdateBusiness,
  validateObjectId,
};