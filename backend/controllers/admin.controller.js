import User from "../models/User";
import { asyncHandler } from "../utils/asyncHandler";

export const getUsers = asyncHandler(async (req, res) => {
  const { role } = req.query;
  const filter = role ? { role } : {};
  const users = await User.find(filter).select("-password_hash");

  res.status(200).json({ users });
});

export const createManager = asyncHandler(async (req, res) => {
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
    role: "MANAGER",
  });
  await user.save();

  res.status(200).json({ message: "Manager created", userId: user._id });
});
