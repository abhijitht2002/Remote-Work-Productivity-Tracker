import jwt from "jsonwebtoken";
import env from "../config/env.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const checkAuth = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    const err = new Error("Authentication required");
    err.statusCode = 401;
    throw err;
  }

  const token = authHeader.split(" ")[1];
  const payload = jwt.verify(token, env.jwtSecret);

  req.user = payload;
  next();
});
