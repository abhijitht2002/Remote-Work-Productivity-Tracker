import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getEmployeeTask,
  startEmployeeTask,
  endEmployeeTask,
} from "../api/employee.api";

function EmployeeTaskDetail() {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);

  const fetchTask = async () => {
    try {
      const data = await getEmployeeTask(id);
      setTask(data);
      setRunning(data.isRunning);
    } catch (err) {
      console.error("Failed to fetch task", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTask();
  }, [id]);

  const handleStart = async () => {
    if (running) return;

    try {
      await startEmployeeTask(id);
      setRunning(true);
      await fetchTask();
    } catch (err) {
      console.error(
        "Start failed:",
        err.response?.data?.message || err.message,
      );
    }
  };

  const handleEnd = async () => {
    try {
      await endEmployeeTask(id);
      setRunning(false);
      fetchTask();
    } catch (err) {
      console.error("End failed", err);
    }
  };

  const formatTime = (seconds = 0) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs}h ${mins}m ${secs}s`;
  };

  if (loading) {
    return <div className="p-6 text-center">Loading task...</div>;
  }

  if (!task) {
    return <div className="p-6 text-center text-red-500">Task not found</div>;
  }

  const isOverdue = task.due_date && new Date(task.due_date) < new Date();

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg border p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            {task.title}
          </h1>
          <span className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-700">
            {task.status}
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-600">
          {task.description || "No description provided"}
        </p>

        {/* Info Grid */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-xl">
            <p className="text-gray-500 text-sm">Total Time</p>
            <p className="text-xl font-semibold text-blue-600">
              {formatTime(task.totalTime)}
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl">
            <p className="text-gray-500 text-sm">Due Date</p>
            <p
              className={`text-lg font-semibold ${
                isOverdue ? "text-red-500" : "text-gray-800"
              }`}
            >
              {task.due_date
                ? new Date(task.due_date).toLocaleDateString()
                : "No deadline"}
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl">
            <p className="text-gray-500 text-sm">Assigned By</p>
            <p className="text-lg font-semibold">
              {task.assigned_by?.name || "Manager"}
            </p>
          </div>
        </div>

        {/* Timer Controls (CORE UX) */}
        <div className="flex gap-4 pt-4 border-t">
          {!running ? (
            <button
              onClick={handleStart}
              className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition shadow"
            >
              ▶ Start Task
            </button>
          ) : (
            <button
              onClick={handleEnd}
              className="bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 transition shadow"
            >
              ⏹ End Task
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default EmployeeTaskDetail;
