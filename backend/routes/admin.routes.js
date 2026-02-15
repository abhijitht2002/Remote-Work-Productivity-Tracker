import express from "express";
import { checkAuth } from "../middlewares/auth.middleware.js";
import { checkRole } from "../middlewares/role.middleware.js";
import {
  createManager,
  getAdminSummary,
  listEmployees,
  listManagers,
} from "../controllers/admin.controller.js";

const router = express.Router();

router.get("/users/employees", checkAuth, checkRole("ADMIN"), listEmployees);
router.get("/users/managers", checkAuth, checkRole("ADMIN"), listManagers);
router.get("/summary", checkAuth, checkRole("ADMIN"), getAdminSummary);
router.post("/managers", checkAuth, checkRole("ADMIN"), createManager);

export default router;
