import express from "express";
import { checkAuth } from "../middlewares/auth.middleware.js";
import {
  addNote,
  deleteNote,
  getNotesById,
  updateNote,
} from "../controllers/notes.controller.js";

const router = express.Router();

router.post("/", checkAuth, addNote);
router.get("/", checkAuth, getNotesById);
router.patch("/:id", checkAuth, updateNote);
router.delete("/:id", checkAuth, deleteNote);

export default router;
