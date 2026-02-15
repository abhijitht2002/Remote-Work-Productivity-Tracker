import Task from "../models/Task.js";
import TimeLog from "../models/TimeLog.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * GET /api/employee/tasks?type=upcoming&page=1
 */
export const getTasks = asyncHandler(async (req, res) => {
  const { type = "upcoming", page = 1, limit = 8 } = req.query;
  const employeeId = req.user.id;

  const filter = {
    assigned_to: employeeId,
  };

  // Match your frontend tabs: upcoming / due / completed
  if (type === "completed") {
    filter.status = "DONE";
  } else if (type === "due") {
    filter.status = "IN_PROGRESS";
  } else if (type === "upcoming") {
    filter.status = { $in: ["TODO", "IN_PROGRESS"] };
  }

  const skip = (Number(page) - 1) * Number(limit);

  const tasks = await Task.find(filter)
    .populate("assigned_to", "name email")
    .populate("assigned_by", "name email")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit))
    .lean();

  // 🔥 IMPORTANT: Same time calculation as manager
  const taskIds = tasks.map((t) => t._id);

  const timeLogs = await TimeLog.aggregate([
    { $match: { task: { $in: taskIds } } },
    {
      $group: {
        _id: "$task",
        totalTime: { $sum: "$duration" }, // seconds
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

export const getTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const employeeId = req.user.id;

  const task = await Task.findOne({
    _id: id,
    assigned_to: employeeId,
  })
    .populate("assigned_to", "name email")
    .populate("assigned_by", "name email")
    .lean();

  if (!task) {
    const err = new Error("Task not found or not assigned to you");
    err.statusCode = 404;
    throw err;
  }

  // ⭐ CHECK ACTIVE TIMER (THIS WAS MISSING)
  const activeLog = await TimeLog.findOne({
    task: id,
    employee: employeeId,
    end_time: null,
  });

  const timeLogs = await TimeLog.aggregate([
    { $match: { task: task._id } },
    {
      $group: {
        _id: "$task",
        totalTime: { $sum: "$duration" },
      },
    },
  ]);

  const totalTime = timeLogs[0]?.totalTime || 0;

  res.status(200).json({
    ...task,
    totalTime,
    isRunning: !!activeLog, // 🔥 THIS FIXES EVERYTHING
  });
});

/**
 * POST /api/employee/task/:id/start
 */
export const startTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const employeeId = req.user.id;

  const task = await Task.findOne({
    _id: id,
    assigned_to: employeeId,
  });

  if (!task) {
    const err = new Error("Task not found or not assigned to you");
    err.statusCode = 404;
    throw err;
  }

  // Prevent multiple active sessions
  const activeLog = await TimeLog.findOne({
    task: id,
    employee: employeeId,
    end_time: null,
  });

  if (activeLog) {
    const err = new Error("Task already running");
    err.statusCode = 400;
    throw err;
  }

  await TimeLog.create({
    task: id,
    employee: employeeId,
    start_time: new Date(),
    end_time: null,
    duration: 0,
  });

  // Optional status update
  if (task.status === "TODO") {
    task.status = "IN_PROGRESS";
    await task.save();
  }

  res.status(200).json({
    message: "Task started successfully",
  });
});

/**
 * POST /api/employee/task/:id/end
 */
export const endTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const employeeId = req.user.id;

  const log = await TimeLog.findOne({
    task: id,
    employee: employeeId,
    end_time: null,
  });

  if (!log) {
    const err = new Error("No active session found for this task");
    err.statusCode = 400;
    throw err;
  }

  const endTime = new Date();
  const duration = Math.floor((endTime - log.start_time) / 1000); // seconds

  log.end_time = endTime;
  log.duration = duration;
  await log.save();

  res.status(200).json({
    message: "Task ended successfully",
    sessionTime: duration,
  });
});

/**
 * GET /api/employee/search?query=design
 */
export const searchTasks = asyncHandler(async (req, res) => {
  const { query = "" } = req.query;
  const employeeId = req.user.id;

  if (!query.trim()) {
    return res.status(200).json({ tasks: [] });
  }

  const tasks = await Task.find({
    assigned_to: employeeId,
    $or: [
      { title: { $regex: query, $options: "i" } },
      { description: { $regex: query, $options: "i" } },
    ],
  })
    .populate("assigned_to", "name email")
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();

  res.status(200).json({ tasks });
});
