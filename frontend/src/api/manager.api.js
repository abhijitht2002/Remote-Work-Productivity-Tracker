import api from "./axios";

export const getTasks = async (type = "assigned", page = 1, limit = 10) => {
  const token = localStorage.getItem("token");

  const res = await api.get(
    `/api/manager/tasks?type=${type}&page=${page}&limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return res.data;
};

export const getTaskById = async (id) => {
  try {
    const token = localStorage.getItem("token");

    const res = await api.get(`/api/manager/tasks/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (error) {
    throw error.response?.data?.error || "Failed to fetch task";
  }
};

export const createTask = async (data) => {
  const token = localStorage.getItem("token");

  const res = await api.post(`/api/manager/tasks`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data.task;
};

export const getEmployees = async (search = "") => {
  const token = localStorage.getItem("token");

  const res = await api.get("/api/manager/employees", {
    params: { search },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data.employees;
};
