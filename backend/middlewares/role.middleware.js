import { asyncHandler } from "../utils/asyncHandler";

export const checkRole = (...allowedRoles) => {
  return asyncHandler(async (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      throw error;
    }
    next();
  });
};
