import express from "express";
import { createEmpl, unifiedLogin } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/login", unifiedLogin);
router.post("/register", createEmpl);

export default router;
