import React, { useEffect, useState } from "react";
import {
  addNote as apiAddNote,
  getNotes,
  updateNote,
  deleteNote as apiDeleteNote,
} from "../api/notes.api";

function Notes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingContent, setEditingContent] = useState("");

  const [newNote, setNewNote] = useState({
    content: "",
  });

  const fetchNotes = async () => {
    try {
      const data = await getNotes();
      setNotes(data.notes || []);
    } catch (err) {
      console.error("Error fetching notes:", err);
      setNotes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleAddNote = async () => {
    if (!newNote.content.trim()) return;

    try {
      setCreating(true);
      const res = await apiAddNote({
        content: newNote.content,
      });

      setNotes([res.note, ...notes]);
      setNewNote({ content: "" });
    } catch (err) {
      console.error("Error adding note:", err);
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await apiDeleteNote(id);
      setNotes((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error("Error deleting note:", err);
    }
  };

  const handleUpdate = async (id) => {
    if (!editingContent.trim()) return;

    try {
      const res = await updateNote(id, { content: editingContent });

      const updatedNote = res.data?.note || res.note;

      setNotes((prev) => prev.map((n) => (n._id === id ? updatedNote : n)));

      setEditingId(null);
      setEditingContent("");
    } catch (err) {
      console.error("Error updating note:", err);
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="text-xl font-semibold text-gray-800">Notes Board</div>

      {/* Add Note Box */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Write a new note..."
          className="border border-gray-300 rounded-md px-3 py-2 flex-1 text-sm"
          value={newNote.content}
          onChange={(e) => setNewNote({ content: e.target.value })}
        />
        <button
          onClick={handleAddNote}
          disabled={creating}
          className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium px-4 py-2 rounded-md transition disabled:opacity-50"
        >
          {creating ? "Adding..." : "Add Note"}
        </button>
      </div>

      {/* Notes Grid */}
      {loading ? (
        <div className="text-gray-500 text-sm">Loading notes...</div>
      ) : notes.length === 0 ? (
        <div className="text-gray-400 text-center py-10">
          No notes yet. Add your first sticky note ✨
        </div>
      ) : (
        <div
          className="grid gap-4 
          grid-cols-1 
          sm:grid-cols-2 
          md:grid-cols-3 
          lg:grid-cols-4"
        >
          {notes.map((note, index) => (
            <div
              key={note._id}
              className="bg-yellow-200 p-4 rounded-lg shadow-md 
              hover:shadow-lg transition 
              flex flex-col justify-between 
              min-h-35 rotate-1"
              style={{
                transform: `rotate(${(index % 3) - 1}deg)`,
              }}
            >
              {/* Content */}
              {editingId === note._id ? (
                <textarea
                  className="bg-transparent outline-none text-gray-800 text-sm resize-none w-full"
                  value={editingContent}
                  onChange={(e) => setEditingContent(e.target.value)}
                  autoFocus
                />
              ) : (
                <div className="text-gray-800 text-sm whitespace-pre-wrap">
                  {note.content}
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-3 mt-3 text-xs">
                {editingId === note._id ? (
                  <>
                    <button
                      onClick={() => handleUpdate(note._id)}
                      className="text-green-600 hover:text-green-800 font-semibold"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditingId(null);
                        setEditingContent("");
                      }}
                      className="text-gray-500 hover:text-gray-700 font-medium"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setEditingId(note._id);
                        setEditingContent(note.content);
                      }}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(note._id)}
                      className="text-red-500 hover:text-red-700 font-medium"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Notes;
