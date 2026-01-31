import express from "express";
import { checkAuth } from "../middlewares/auth.middleware.js";
import { checkRole } from "../middlewares/role.middleware.js";
import { createManager, getUsers } from "../controllers/admin.controller.js";

const router = express.Router();

router.get("/users", checkAuth, checkRole("ADMIN"), getUsers);
router.post("/managers", checkAuth, checkRole("ADMIN"), createManager);

export default router;
