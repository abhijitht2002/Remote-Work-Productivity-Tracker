import express from "express";
import { checkAuth } from "../middlewares/auth.middleware.js";
import { checkRole } from "../middlewares/role.middleware.js";
import {
  assignTask,
  createTask,
  getEmployees,
  getTaskById,
  getTasks,
  searchTasks,
} from "../controllers/manager.controller.js";

const router = express.Router();

router.post("/tasks", checkAuth, checkRole("MANAGER"), createTask);
router.get("/tasks", checkAuth, checkRole("MANAGER"), getTasks);
router.get("/tasks/:id", checkAuth, checkRole("MANAGER"), getTaskById);
router.get("/search", checkAuth, checkRole("MANAGER"), searchTasks);
router.patch("/tasks/:id/assign", checkAuth, checkRole("MANAGER"), assignTask);

router.get("/employees", checkAuth, checkRole("MANAGER"), getEmployees);

export default router;
