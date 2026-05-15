// ✅ ROLE-BASED ACCESS CONTROL MIDDLEWARE

/**
 * Check if user is admin
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
exports.isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Not authenticated",
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied: Admin privileges required",
    });
  }

  next();
};

/**
 * Check if user is business owner
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
exports.isBusiness = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Not authenticated",
    });
  }

  if (req.user.role !== "business") {
    return res.status(403).json({
      success: false,
      message: "Access denied: Business account required",
    });
  }

  next();
};

/**
 * Check if user has specific roles
 * @param {...String} roles - Allowed roles
 * @returns {Function} Middleware function
 */
exports.allowRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied: Only ${roles.join(", ")} can access this resource`,
      });
    }

    next();
  };
};

/**
 * Check if user is admin OR business owner
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
exports.isAdminOrBusiness = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Not authenticated",
    });
  }

  if (!["admin", "business"].includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: "Access denied: Admin or Business account required",
    });
  }

  next();
};

/**
 * Check if user is regular user (not admin or business)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
exports.isRegularUser = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Not authenticated",
    });
  }

  if (req.user.role === "admin" || req.user.role === "business") {
    return res.status(403).json({
      success: false,
      message: "Access denied: Regular users only",
    });
  }

  next();
};

/**
 * Check if user owns a resource (by user ID)
 * @param {String} paramName - The parameter name containing the user ID to check
 * @returns {Function} Middleware function
 */
exports.isOwner = (paramName = "userId") => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    const resourceOwnerId = req.params[paramName];
    if (!resourceOwnerId) {
      return res.status(400).json({
        success: false,
        message: `Missing parameter: ${paramName}`,
      });
    }

    // Allow admins to access any resource
    if (req.user.role === "admin") {
      return next();
    }

    // Check if current user owns the resource
    if (req.user.id !== resourceOwnerId) {
      return res.status(403).json({
        success: false,
        message: "Access denied: You can only access your own resources",
      });
    }

    next();
  };
};

/**
 * Check if user is owner OR admin
 * @param {String} paramName - The parameter name containing the user ID
 * @returns {Function} Middleware function
 */
exports.isOwnerOrAdmin = (paramName = "userId") => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    const resourceOwnerId = req.params[paramName];
    
    // Allow admins
    if (req.user.role === "admin") {
      return next();
    }

    // Check if owner
    if (req.user.id !== resourceOwnerId) {
      return res.status(403).json({
        success: false,
        message: "Access denied: Admin or resource owner only",
      });
    }

    next();
  };
};

/**
 * Role-based permission checker (generic)
 * @param {Function} checkFn - Function that returns true/false based on req, res
 * @param {String} errorMessage - Error message if check fails
 * @returns {Function} Middleware function
 */
exports.hasPermission = (checkFn, errorMessage = "Access denied") => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    try {
      if (!checkFn(req)) {
        return res.status(403).json({
          success: false,
          message: errorMessage,
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Permission check failed",
        error: error.message,
      });
    }
  };
};
