import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getEmployeeTasks } from "../api/employee.api";

function EmployeeTasks() {
  const location = useLocation();
  const navigate = useNavigate();

  const getTypeFromPath = (pathname) => {
    if (pathname.includes("/tasks/due")) return "due";
    if (pathname.includes("/tasks/completed")) return "completed";
    return "upcoming";
  };

  const type = getTypeFromPath(location.pathname);

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [location.pathname]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await getEmployeeTasks(type, page);

      setTasks(data.tasks || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("Failed to fetch employee tasks", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [type, page]);

  const formatTime = (seconds = 0) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hrs}h ${mins}m`;
  };

  const isOverdue = (due) => {
    if (!due) return false;
    return new Date(due) < new Date();
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold capitalize text-gray-800">
        {type} Tasks
      </h1>

      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading tasks...</div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-12 text-gray-400 text-lg">
          No {type} tasks available
        </div>
      ) : (
        <>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {tasks.map((task) => (
              <div
                key={task._id}
                onClick={() => navigate(`/dashboard/employee/task/${task._id}`)}
                className="bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition cursor-pointer"
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-gray-800 text-lg">
                    {task.title}
                  </h3>
                  <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                    {task.status}
                  </span>
                </div>

                <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                  {task.description || "No description provided"}
                </p>

                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Total Time</span>
                    <span className="font-medium text-blue-600">
                      {formatTime(task.totalTime)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-500">Due Date</span>
                    <span
                      className={`font-medium ${
                        isOverdue(task.due_date)
                          ? "text-red-500"
                          : "text-gray-700"
                      }`}
                    >
                      {task.due_date
                        ? new Date(task.due_date).toLocaleDateString()
                        : "No deadline"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-end items-center gap-3 mt-6">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-4 py-2 border rounded-lg disabled:opacity-40"
            >
              Prev
            </button>

            <span className="text-gray-700 font-medium">
              Page {page} of {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 border rounded-lg disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default EmployeeTasks;
