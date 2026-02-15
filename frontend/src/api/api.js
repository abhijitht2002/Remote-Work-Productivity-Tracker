import api from "./axios";

export const loginUser = async (credentials) => {
  try {
    const res = await api.post("/api/auth/login", credentials);
    return res.data;
  } catch (error) {
    throw error.response?.data?.error || "Login failed";
  }
};

export const getAdminSummary = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await api.get("/api/admin/summary", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (error) {
    throw error.response?.data?.error || "Failed to fetch summary";
  }
};

export const listEmployees = async (page = 1, limit = 5) => {
  try {
    const token = localStorage.getItem("token");

    const res = await api.get("/api/admin/users/employees", {
      params: { page, limit },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (error) {
    throw error.response?.data?.error || "Sorry can't find employees";
  }
};

export const listManagers = async (page = 1, limit = 5) => {
  try {
    const token = localStorage.getItem("token");

    const res = await api.get("/api/admin/users/managers", {
      params: { page, limit },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (error) {
    throw error.response?.data?.error || "Sorry can't find managers";
  }
};

export const createManager = async (data) => {
  try {
    const token = localStorage.getItem("token");

    const res = await api.post("/api/admin/managers", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (error) {
    throw error.response?.data?.error || "Sorry can't create manager";
  }
};

export const deleteManager = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await api.post(
      "/api/admin/managers",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
      data,
    );

    return res.data;
  } catch (error) {
    throw error.response?.data?.error || "Sorry can't create manager";
  }
};

export const getNotes = async () => {};
export const createNotes = async () => {};
