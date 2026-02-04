import Task from "../models/Task";
import User from "../models/User";
import { asyncHandler } from "../utils/asyncHandler";

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

export const getTask = asyncHandler(async (req, res) => {
  // get task by man_id
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

export const extendDate = asyncHandler(async (req, res) => {
  
});

export const getAllEmployees = asyncHandler(async (req, res) => {
  const employees = await User.find({ role: "EMPLOYEE" }).select("name email");

  res.status(201).json({ employees });
});
