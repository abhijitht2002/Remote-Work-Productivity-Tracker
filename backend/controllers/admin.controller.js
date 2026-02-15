import User from "../models/User.js";
import bcrypt from "bcrypt";
import { asyncHandler } from "../utils/asyncHandler.js";
import Task from "../models/Task.js";

export const listEmployees = async (req, res) => {
  const { page = 1, limit = 5 } = req.query;

  const employees = await User.paginate(
    { role: "EMPLOYEE" },
    {
      page,
      limit,
      lean: true,
      sort: { createdAt: -1 },
    },
  );

  const docsWithStats = await Promise.all(
    employees.docs.map(async (emp) => {
      const tasks = await Task.countDocuments({
        assigned_to: emp._id,
      });

      const completed = await Task.countDocuments({
        assigned_to: emp._id,
        status: "DONE",
      });

      return {
        ...emp,
        tasks,
        completed,
        workTime: "0h",
      };
    }),
  );

  res.json({
    ...employees,
    docs: docsWithStats,
  });
};

export const listManagers = async (req, res) => {
  const { page = 1, limit = 5 } = req.query;

  const managers = await User.paginate(
    { role: "MANAGER" },
    {
      page,
      limit,
      lean: true,
      sort: { createdAt: -1 },
    },
  );

  const docsWithStats = await Promise.all(
    managers.docs.map(async (manager) => {
      const tasksCreated = await Task.countDocuments({
        assigned_by: manager._id,
      });

      const employeesAssigned = await Task.distinct("assigned_to", {
        assigned_by: manager._id,
        assigned_to: { $ne: null },
      });

      return {
        ...manager,
        tasksCreated,
        employeesAssigned: employeesAssigned.length,
      };
    }),
  );

  res.json({
    ...managers,
    docs: docsWithStats,
  });
};

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

  res.status(201).json({ message: "Manager created", userId: user._id });
});

export const getAdminSummary = async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalManagers = await User.countDocuments({ role: "MANAGER" });
  const totalEmployees = await User.countDocuments({ role: "EMPLOYEE" });
  const totalTasks = await Task.countDocuments();

  const recentManagers = await User.find({ role: "MANAGER" })
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  const managersWithStats = await Promise.all(
    recentManagers.map(async (manager) => {
      const tasksCreated = await Task.countDocuments({
        assigned_by: manager._id,
      });

      const employeesAssigned = await Task.distinct("assigned_to", {
        assigned_by: manager._id,
        assigned_to: { $ne: null },
      });

      return {
        ...manager,
        tasksCreated,
        employeesAssigned: employeesAssigned.length,
      };
    }),
  );

  const recentEmployees = await User.find({ role: "EMPLOYEE" })
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  const employeesWithStats = await Promise.all(
    recentEmployees.map(async (emp) => {
      const tasksAssigned = await Task.countDocuments({
        assigned_to: emp._id,
      });

      const tasksCompleted = await Task.countDocuments({
        assigned_to: emp._id,
        status: "DONE",
      });

      return {
        ...emp,
        tasksAssigned,
        tasksCompleted,
        totalWorkTime: "0h",
      };
    }),
  );

  res.json({
    metrics: {
      totalUsers,
      totalManagers,
      totalEmployees,
      totalTasks,
    },
    recentManagers: managersWithStats,
    recentEmployees: employeesWithStats,
  });
};
