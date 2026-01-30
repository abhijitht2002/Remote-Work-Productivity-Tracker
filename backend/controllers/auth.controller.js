import User from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import env from "../config/env";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createEmpl = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(409).json({ error: "User already exists" });
  }

  const hashPass = await bcrypt.hash(password, 10);
  const user = new User({
    name,
    email,
    password_hash: hashPass,
    role: "EMPLOYEE",
  });
  await user.save();
  res.status(201).json({ message: "Employee created", userId: user._id });
});

export const unifiedLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return res.status(404).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: user._id, name: user.name, role: user.role },
    env.jwtSecret,
    { expiresIn: "1h" },
  );

  res.status(200).json({ message: "Login successful", token });
});

export const logout = (req, res) => {
  // if using JWT only (no refresh token)
  // frontend can just delete token
  // if using refresh token stored in DB/cookie:
  // delete token from DB / clear cookie

  res.status(200).json({ message: "Logged out successfully" });
};
