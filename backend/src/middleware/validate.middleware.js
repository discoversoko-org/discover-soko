// src/middleware/validate.middleware.js

const ApiError = require(
  "../shared/utils/ApiError"
);

/* =========================================
   VALIDATION MIDDLEWARE
========================================= */

const validateMiddleware =
  (
    validator
  ) => {
    return async (
      req,
      _res,
      next
    ) => {
      try {
        /*
          Supports:
          - Joi
          - Zod
          - Custom validators
        */

        const validatedData =
          await validator(
            req.body
          );

        /*
          Replace request body
          with validated data
        */

        if (
          validatedData
        ) {
          req.body =
            validatedData;
        }

        next();
      } catch (error) {
        /*
          Zod errors
        */

        if (
          error.errors
        ) {
          return next(
            new ApiError(
              400,
              error.errors
                ?.map(
                  (
                    item
                  ) =>
                    item.message
                )
                .join(", ") ||
                "Validation failed"
            )
          );
        }

        /*
          Joi errors
        */

        if (
          error.details
        ) {
          return next(
            new ApiError(
              400,
              error.details
                ?.map(
                  (
                    item
                  ) =>
                    item.message
                )
                .join(", ") ||
                "Validation failed"
            )
          );
        }

        /*
          Generic validation error
        */

        return next(
          new ApiError(
            400,
            error.message ||
              "Validation failed"
          )
        );
      }
    };
  };

/* =========================================
   EXPORT
========================================= */

module.exports =
  validateMiddleware;