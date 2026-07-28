const asyncHandler = require(
  "../../shared/utils/asyncHandler"
);

const sendResponse = require(
  "../../shared/utils/sendResponse"
);

const userService = require(
  "./user.service"
);

const {
  validateUpdateUser,
  validateChangePassword,
} = require(
  "./user.validation"
);

/* =========================================
   GET CURRENT USER
========================================= */

exports.getMe =
  asyncHandler(async (req, res) => {
    const user =
      await userService.getProfile(
        req.user.id
      );

    return sendResponse(
      res,
      200,
      true,
      "User fetched successfully",
      {
        user,
      }
    );
  });

/* =========================================
   UPDATE PROFILE
========================================= */

exports.updateProfile =
  asyncHandler(async (req, res) => {
    if (
      Object.keys(req.body)
        .length > 0
    ) {
      validateUpdateUser(
        req.body
      );
    }

    const updatedUser =
      await userService.updateProfile(
        {
          userId:
            req.user.id,

          data:
            req.body || {},

          file:
            req.file || null,
        }
      );

    return sendResponse(
      res,
      200,
      true,
      "Profile updated successfully",
      {
        user:
          updatedUser,
      }
    );
  });

/* =========================================
   CHANGE PASSWORD
========================================= */

exports.changePassword =
  asyncHandler(async (req, res) => {
    validateChangePassword(
      req.body
    );

    const result =
      await userService.changePassword(
        {
          userId:
            req.user.id,

          currentPassword:
            req.body
              .currentPassword,

          newPassword:
            req.body
              .newPassword,
        }
      );

    return sendResponse(
      res,
      200,
      true,
      result.message
    );
  });

/* =========================================
   DELETE ACCOUNT
========================================= */

exports.deleteAccount =
  asyncHandler(async (req, res) => {
    const result =
      await userService.deleteAccount(
        req.user.id
      );

    return sendResponse(
      res,
      200,
      true,
      result.message
    );
  });