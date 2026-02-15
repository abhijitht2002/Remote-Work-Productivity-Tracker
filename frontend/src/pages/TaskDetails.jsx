import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTaskById } from "../api/manager.api";

function TaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchTask = async () => {
    try {
      setLoading(true);
      const data = await getTaskById(id);
      setTask(data);
    } catch (err) {
      console.error("Failed to fetch task", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTask();
  }, [id]);

  const formatTime = (seconds = 0) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hrs}h ${mins}m`;
  };

  if (loading) {
    return <div className="p-6 text-gray-500">Loading task...</div>;
  }

  if (!task) {
    return <div className="p-6 text-red-500">Task not found</div>;
  }

  return (
    <div className="p-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-blue-600 hover:underline"
      >
        ← Back
      </button>

      <div className="bg-white rounded-2xl shadow-md border p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <h1 className="text-2xl font-bold text-gray-800">{task.title}</h1>
          <span className="px-3 py-1 text-sm rounded-full bg-gray-100">
            {task.status}
          </span>
        </div>

        {/* Description */}
        <div>
          <h2 className="font-semibold text-gray-700 mb-1">Description</h2>
          <p className="text-gray-600">
            {task.description || "No description provided"}
          </p>
        </div>

        {/* Details Grid */}
        <div className="grid md:grid-cols-2 gap-6 text-sm">
          <div className="space-y-2">
            <div>
              <span className="text-gray-500">Assigned To:</span>
              <div className="font-medium">
                {task.assigned_to?.name || "Unassigned"}
              </div>
              <div className="text-gray-500 text-xs">
                {task.assigned_to?.email || ""}
              </div>
            </div>

            <div>
              <span className="text-gray-500">Created By:</span>
              <div className="font-medium">{task.assigned_by?.name}</div>
            </div>
          </div>

          <div className="space-y-2">
            <div>
              <span className="text-gray-500">Start Date:</span>
              <div className="font-medium">
                {task.start_date
                  ? new Date(task.start_date).toLocaleDateString()
                  : "Not set"}
              </div>
            </div>

            <div>
              <span className="text-gray-500">Due Date:</span>
              <div className="font-medium">
                {task.due_date
                  ? new Date(task.due_date).toLocaleDateString()
                  : "No deadline"}
              </div>
            </div>

            <div>
              <span className="text-gray-500">Total Work Time:</span>
              <div className="font-medium text-blue-600">
                {formatTime(task.totalTime)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskDetails;
