import api from "./axios";

export const getNotes = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await api.get("/api/notes", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (error) {
    // throw "Failed to fetch notes";
    console.error("Actual API error:", error.response?.data || error.message);
    throw error;
  }
};

export const addNote = async (data) => {
  try {
    const token = localStorage.getItem("token");

    const res = await api.post("/api/notes", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (error) {
    throw "Failed to add note";
  }
};

export const updateNote = async (id, data) => {
  try {
    const token = localStorage.getItem("token");

    const res = await api.patch(`/api/notes/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (error) {
    throw "Failed to update note";
  }
};

export const deleteNote = async (id) => {
  try {
    const token = localStorage.getItem("token");

    const res = await api.delete(`/api/notes/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (error) {
    throw "Failed to delete note";
  }
};
