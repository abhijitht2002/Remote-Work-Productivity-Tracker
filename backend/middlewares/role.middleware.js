import { asyncHandler } from "../utils/asyncHandler.js";

export const checkRole = (...allowedRoles) => {
  return asyncHandler(async (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      const err = new Error("Access denied");
      err.statusCode = 403;
      throw err;
    }
    next();
  });
};
