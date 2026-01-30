import express from "express";
import { createEmpl, unifiedLogin } from "../controllers/auth.controller";

const router = express.Router();

router.get("/login", unifiedLogin);
router.post("/register", createEmpl);

export default router;
