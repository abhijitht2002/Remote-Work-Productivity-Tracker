import express from "express";
import { checkAuth } from "../middlewares/auth.middleware.js";
import { checkRole } from "../middlewares/role.middleware.js";
import {
  endTask,
  getTask,
  getTasks,
  searchTasks,
  startTask,
} from "../controllers/employee.controller.js";

const router = express.Router();

router.get("/tasks", checkAuth, checkRole("EMPLOYEE"), getTasks);
router.get("/task/:id", checkAuth, checkRole("EMPLOYEE"), getTask);
router.post("/task/:id/start", checkAuth, checkRole("EMPLOYEE"), startTask);
router.post("/task/:id/end", checkAuth, checkRole("EMPLOYEE"), endTask);
router.get("/search", checkAuth, checkRole("EMPLOYEE"), searchTasks);

export default router;
