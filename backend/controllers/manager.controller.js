import Task from "../models/Task.js";
import User from "../models/User.js";
import TimeLog from "../models/TimeLog.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createTask = asyncHandler(async (req, res) => {
  const { title, description, start_date, due_date, assigned_to } = req.body;

  const newTask = new Task({
    title,
    description,
    status: "TODO",
    start_date: start_date ? new Date(start_date) : null,
    due_date: due_date ? new Date(due_date) : null,
    assigned_by: req.user.id,
    assigned_to: assigned_to || null,
  });

  const task = await newTask.save();

  res.status(201).json({
    message: "Task created successfully",
    task,
  });
});

export const getTasks = asyncHandler(async (req, res) => {
  const { type, page = 1, limit = 8 } = req.query;
  const managerId = req.user.id;

  let filter = { assigned_by: managerId };

  if (type === "assigned") {
    filter.assigned_to = { $ne: null };
    filter.status = { $ne: "DONE" };
  } else if (type === "unassigned") {
    filter.assigned_to = null;
    filter.status = { $ne: "DONE" };
  } else if (type === "closed") {
    filter.status = "DONE";
  }

  const skip = (page - 1) * limit;

  const tasks = await Task.find(filter)
    .populate("assigned_to", "name email")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit))
    .lean();

  const taskIds = tasks.map((t) => t._id);

  const timeLogs = await TimeLog.aggregate([
    { $match: { task: { $in: taskIds } } },
    {
      $group: {
        _id: "$task",
        totalTime: { $sum: "$duration" }, // duration in seconds
      },
    },
  ]);

  const timeMap = {};
  timeLogs.forEach((log) => {
    timeMap[log._id.toString()] = log.totalTime;
  });

  const tasksWithTime = tasks.map((task) => ({
    ...task,
    totalTime: timeMap[task._id.toString()] || 0,
  }));

  const total = await Task.countDocuments(filter);

  res.status(200).json({
    tasks: tasksWithTime,
    page: Number(page),
    totalPages: Math.ceil(total / limit),
  });
});

export const assignTask = asyncHandler(async (req, res) => {
  const { assigned_to } = req.body;
  if (!assigned_to) {
    const err = new Error("Not found");
    err.statusCode = 404;
    throw err;
  }

  const task = await Task.findById(req.params.id);
  if (!task) {
    const err = new Error("Not found");
    err.statusCode = 404;
    throw err;
  }

  if (task.assigned_to) {
    const err = new Error("Already assigned");
    err.statusCode = 409;
    throw err;
  }

  task.assigned_to = assigned_to;
  await task.save();

  res.status(201).json({ message: "Task assigned", task });
});

export const extendDate = asyncHandler(async (req, res) => {});

export const getEmployees = asyncHandler(async (req, res) => {
  const employees = await User.find({ role: "EMPLOYEE" })
    .select("name email")
    .sort({ name: 1 })
    .lean();

  res.status(200).json({ employees });
});

// GET /api/tasks/:id
export const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("assigned_to", "name email")
      .populate("assigned_by", "name email");

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json(task);
  } catch (err) {
    next(err);
  }
};

export const searchTasks = asyncHandler(async (req, res) => {
  const { query = "", type } = req.query;
  const managerId = req.user.id;

  let filter = {
    assigned_by: managerId,
    title: { $regex: query, $options: "i" }, // case-insensitive search
  };

  // keep SAME logic as getTasks (very important)
  if (type === "assigned") {
    filter.assigned_to = { $ne: null };
    filter.status = { $ne: "DONE" };
  } else if (type === "unassigned") {
    filter.assigned_to = null;
    filter.status = { $ne: "DONE" };
  } else if (type === "closed") {
    filter.status = "DONE";
  }

  const tasks = await Task.find(filter)
    .populate("assigned_to", "name email")
    .sort({ createdAt: -1 })
    .lean();

  res.status(200).json({ tasks });
});
