import express from "express";
import { checkAuth } from "../middlewares/auth.middleware";
import { checkRole } from "../middlewares/role.middleware";
import { createManager, getUsers } from "../controllers/admin.controller";

const router = express.Router();

router.get("/users", checkAuth, checkRole("ADMIN"), getUsers);
router.post("/managers", checkAuth, checkRole("ADMIN"), createManager);

export default router;
