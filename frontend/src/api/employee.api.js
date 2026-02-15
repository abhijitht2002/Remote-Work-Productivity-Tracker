import api from "./axios";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
  };
};

export const getEmployeeTasks = async (type = "upcoming", page = 1) => {
  const res = await api.get("/api/employee/tasks", {
    params: { type, page },
    headers: getAuthHeader(),
  });
  return res.data;
};

export const getEmployeeTask = async (id) => {
  const res = await api.get(`/api/employee/task/${id}`, {
    headers: getAuthHeader(),
  });
  return res.data;
};

export const startEmployeeTask = async (id) => {
  const res = await api.post(
    `/api/employee/task/${id}/start`,
    {},
    {
      headers: getAuthHeader(),
    },
  );
  return res.data;
};

export const endEmployeeTask = async (id) => {
  const res = await api.post(
    `/api/employee/task/${id}/end`,
    {},
    {
      headers: getAuthHeader(),
    },
  );
  return res.data;
};

export const searchEmployeeTasks = async (query) => {
  const res = await api.get("/api/employee/search", {
    params: { query },
    headers: getAuthHeader(),
  });
  return res.data.tasks;
};
