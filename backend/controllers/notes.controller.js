import Note from "../models/Note.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const addNote = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const userId = req.user.id;

  const newNote = new Note({
    user_id: userId,
    content,
  });

  const note = await newNote.save();

  res.status(201).json({ message: "Note added successfully", note });
});

export const getNotesById = asyncHandler(async (req, res) => {
  const notes = await Note.find({ user_id: req.user.id });
  res.status(200).json({ notes });
});

export const updateNote = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const userId = req.user.id;

  const note = await Note.findById(id);
  if (!note) {
    const err = new Error("Not found");
    err.statusCode = 404;
    throw err;
  }

  if (note.user_id.toString() !== userId) {
    const err = new Error("Not authorized");
    err.statusCode = 403;
    throw err;
  }

  note.content = content;
  await note.save();

  res.status(200).json({
    message: "Task updated successfully",
    note,
  });
});

export const deleteNote = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const note = await Note.findOneAndDelete({
    _id: id,
    user_id: req.user.id,
  });

  if (!note) {
    const err = new Error("Not found");
    err.statusCode = 404;
    throw err;
  }

  res.status(200).json({ message: "Task deleted successfully" });
});
