const mongoose = require("mongoose");


/* 🆔 Validate Mongo ID */
const validateObjectId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw { status: 400, message: "Invalid business/user ID" };
  }
};


/* ❌ Validate Rejection Reason */
const validateRejectionReason = (reason) => {
  if (!reason || typeof reason !== "string" || reason.trim().length < 5) {
    throw {
      status: 400,
      message: "Rejection reason must be at least 5 characters",
    };
  }
};


/* 📦 Validate Admin Action Payload (optional reuse helper) */
const validateAdminAction = ({ id, reason }) => {
  validateObjectId(id);

  if (reason !== undefined) {
    validateRejectionReason(reason);
  }
};


module.exports = {
  validateObjectId,
  validateRejectionReason,
  validateAdminAction,
};