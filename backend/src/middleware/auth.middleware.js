// src/middleware/auth.middleware.js

const jwt = require(
  "jsonwebtoken"
);

const {
  jwt: jwtConfig,
} = require("../config");

const asyncHandler = require(
  "../shared/utils/asyncHandler"
);

const ApiError = require(
  "../shared/utils/ApiError"
);

const User = require(
  "../models/User"
);

/* =========================================
   AUTH MIDDLEWARE
========================================= */

const authMiddleware =
  asyncHandler(
    async (
      req,
      _res,
      next
    ) => {
      let token = null;

      /* =========================================
         GET TOKEN
      ========================================= */

      if (
        req.cookies
          ?.accessToken
      ) {
        token =
          req.cookies
            .accessToken;
      }

      if (
        !token &&
        req.headers.authorization?.startsWith(
          "Bearer "
        )
      ) {
        token =
          req.headers.authorization.split(
            " "
          )[1];
      }

      if (!token) {
        throw new ApiError(
          401,
          "Authentication required"
        );
      }

      /* =========================================
         VERIFY TOKEN
      ========================================= */

      const decoded =
        jwt.verify(
          token,
          jwtConfig
            .accessToken
            .secret
        );

      /* =========================================
         GET USER
      ========================================= */

      const user =
        await User.findById(
          decoded.id
        ).select(
          "-password"
        );

      if (!user) {
        throw new ApiError(
          401,
          "User not found"
        );
      }

      req.user = user;

      next();
    }
  );

/* =========================================
   EXPORT
========================================= */

module.exports =
  authMiddleware;