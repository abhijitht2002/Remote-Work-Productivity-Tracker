import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getTasks, createTask, getEmployees } from "../api/manager.api";

function Task() {
  const location = useLocation();

  const getTypeFromPath = (pathname) => {
    if (pathname.includes("/tasks/unassigned")) return "unassigned";
    if (pathname.includes("/tasks/closed")) return "closed";
    return "assigned";
  };

  const type = getTypeFromPath(location.pathname);

  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [employeeSearch, setEmployeeSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    start_date: "",
    due_date: "",
  });

  // Detect page type from route
  useEffect(() => {
    setPage(1);
  }, [location.pathname]);

  const showFixedForm = type === "assigned" || type === "unassigned";

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await getTasks(type, page);

      if (data?.tasks) {
        setTasks(data.tasks);
      }
    } catch (err) {
      console.error("Failed to fetch tasks", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [type, page]);

  const handleCreateTask = async () => {
    if (!newTask.title.trim()) return;

    try {
      await createTask({
        ...newTask,
        assigned_to: selectedEmployee?._id || null,
      });

      // Reset form only (no UI flicker)
      setNewTask({
        title: "",
        description: "",
        start_date: "",
        due_date: "",
      });
      setSelectedEmployee(null);
      setPage(1);
      fetchTasks();
    } catch (err) {
      console.error("Failed to create task", err);
    }
  };

  const formatTime = (seconds = 0) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hrs}h ${mins}m`;
  };

  const isOverdue = (due) => {
    if (!due) return false;
    return new Date(due) < new Date();
  };

  useEffect(() => {
    if (showAssignModal) {
      fetchEmployees();
    }
  }, [showAssignModal]);

  const fetchEmployees = async () => {
    try {
      const data = await getEmployees(employeeSearch);
      setEmployees(data);
    } catch (err) {
      console.error("Failed to fetch employees", err);
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <h1 className="text-2xl md:text-3xl font-bold capitalize text-gray-800">
        {type} Tasks
      </h1>

      {showFixedForm && (
        <div className="bg-white p-5 rounded-2xl shadow-md border space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Create New Task
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Task Title *"
              value={newTask.title}
              onChange={(e) =>
                setNewTask({ ...newTask, title: e.target.value })
              }
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <input
              type="text"
              placeholder="Description"
              value={newTask.description}
              onChange={(e) =>
                setNewTask({ ...newTask, description: e.target.value })
              }
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <input
              type="date"
              value={newTask.start_date}
              onChange={(e) =>
                setNewTask({ ...newTask, start_date: e.target.value })
              }
              className="border rounded-lg px-3 py-2"
            />

            <input
              type="date"
              value={newTask.due_date}
              onChange={(e) =>
                setNewTask({ ...newTask, due_date: e.target.value })
              }
              className="border rounded-lg px-3 py-2"
            />

            {/* Assign Field */}
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700">
                Assigned Employee
              </label>

              {!selectedEmployee ? (
                <button
                  onClick={() => setShowAssignModal(true)}
                  className="mt-2 w-full border-dashed border-2 border-gray-300 py-2 rounded-lg hover:bg-gray-50"
                >
                  + Select Employee (Optional)
                </button>
              ) : (
                <div className="flex items-center justify-between mt-2 border rounded-lg px-3 py-2 bg-gray-50">
                  <span className="font-medium text-gray-800">
                    {selectedEmployee.name}
                  </span>
                  <button
                    onClick={() => setSelectedEmployee(null)}
                    className="text-red-500 text-sm hover:underline"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleCreateTask}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 transition shadow"
            >
              Create Task
            </button>
          </div>
        </div>
      )}

      {/* Assign Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-[90%] max-w-md shadow-xl">
            <h2 className="text-xl font-bold mb-4">Select Employee</h2>

            {/* 🔍 Search Input */}
            <input
              type="text"
              placeholder="Search employees..."
              value={employeeSearch}
              onChange={(e) => setEmployeeSearch(e.target.value)}
              className="w-full mb-4 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />

            {/* Employee List */}
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {employees.length === 0 ? (
                <div className="text-center text-gray-400 py-6">
                  No employees found
                </div>
              ) : (
                employees
                  .filter((emp) =>
                    `${emp.name} ${emp.email}`
                      .toLowerCase()
                      .includes(employeeSearch.toLowerCase()),
                  )
                  .map((emp) => (
                    <button
                      key={emp._id}
                      onClick={() => {
                        setSelectedEmployee(emp);
                        setShowAssignModal(false);
                      }}
                      className="w-full text-left px-4 py-3 border rounded-lg hover:bg-blue-50 transition flex justify-between"
                    >
                      <span className="font-medium text-gray-800">
                        {emp.name}
                      </span>
                      <span className="text-sm text-gray-500">
                        {emp.email || "No email"}
                      </span>
                      <span className="text-sm text-gray-400">Select</span>
                    </button>
                  ))
              )}
            </div>

            <button
              onClick={() => setShowAssignModal(false)}
              className="mt-4 w-full border py-2 rounded-lg hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Task Cards */}
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
                onClick={() => navigate(`/dashboard/task/${task._id}`)}
                className="bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition duration-200"
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-gray-800 text-lg">
                    {task.title}
                  </h3>
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-100">
                    {task.status}
                  </span>
                </div>

                <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                  {task.description || "No description provided"}
                </p>

                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Assigned</span>
                    <span className="font-medium">
                      {task.assigned_to ? task.assigned_to.name : "Unassigned"}
                    </span>
                  </div>

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
          <div className="flex flex-col sm:flex-row justify-end items-center gap-3 mt-6">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-4 py-2 border rounded-lg disabled:opacity-40 hover:bg-gray-50"
            >
              Prev
            </button>

            <span className="text-gray-700 font-medium">
              Page {page} of {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 border rounded-lg disabled:opacity-40 hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Task;
