import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAdminSummary } from "../api/api";

function Summary() {
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    totalManagers: 0,
    totalEmployees: 0,
    totalTasks: 0,
  });

  const [managers, setManagers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const data = await getAdminSummary();

      setMetrics(data.metrics || {});
      setManagers(data.recentManagers || []);
      setEmployees(data.recentEmployees || []);
    } catch (err) {
      console.error("Error fetching summary:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  if (loading) {
    return <div className="p-6 text-gray-500">Loading dashboard...</div>;
  }

  return (
    <div className="p-6 space-y-8">
      {/* Top Metrics Cluster */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { title: "Total Users", value: metrics.totalUsers },
          { title: "Total Managers", value: metrics.totalManagers },
          { title: "Total Employees", value: metrics.totalEmployees },
          { title: "Total Tasks Created", value: metrics.totalTasks },
        ].map((metric, idx) => (
          <div key={idx} className="bg-white shadow rounded p-4 flex flex-col">
            <div className="text-gray-500 text-sm">{metric.title}</div>
            <div className="text-2xl font-bold">{metric.value}</div>
          </div>
        ))}
      </div>

      {/* Managers List */}
      <div>
        <div className="text-gray-700 font-semibold text-lg mb-3">
          Recent Managers
        </div>
        <div className="grid gap-4">
          {managers.length === 0 ? (
            <div className="text-gray-500 text-sm">No managers found</div>
          ) : (
            managers.map((manager) => (
              <div
                key={manager._id}
                className="bg-white shadow rounded p-4 flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-2"
              >
                <div className="font-medium text-gray-800">{manager.name}</div>
                <div className="flex gap-4 flex-wrap text-gray-600 text-sm mt-1 sm:mt-0">
                  <div className="bg-gray-100 px-2 py-1 rounded">
                    Employees: {manager.employeesAssigned || 0}
                  </div>
                  <div className="bg-gray-100 px-2 py-1 rounded">
                    Tasks: {manager.tasksCreated || 0}
                  </div>
                </div>
              </div>
            ))
          )}

          <div className="text-right">
            <Link
              to="/dashboard/users/managers"
              className="text-blue-600 text-sm hover:underline"
            >
              See More
            </Link>
          </div>
        </div>
      </div>

      {/* Employees List */}
      <div>
        <div className="text-gray-700 font-semibold text-lg mb-3">
          Recent Employees
        </div>
        <div className="grid gap-4">
          {employees.length === 0 ? (
            <div className="text-gray-500 text-sm">No employees found</div>
          ) : (
            employees.map((emp) => (
              <div
                key={emp._id}
                className="bg-white shadow rounded p-4 flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-2"
              >
                <div className="font-medium text-gray-800">{emp.name}</div>
                <div className="flex gap-2 flex-wrap text-gray-600 text-sm mt-1 sm:mt-0">
                  <div className="bg-gray-100 px-2 py-1 rounded">
                    Tasks: {emp.tasksAssigned || 0}
                  </div>
                  <div className="bg-gray-100 px-2 py-1 rounded">
                    Completed: {emp.tasksCompleted || 0}
                  </div>
                  <div className="bg-gray-100 px-2 py-1 rounded">
                    Time: {emp.totalWorkTime || "0h"}
                  </div>
                </div>
              </div>
            ))
          )}

          <div className="text-right">
            <Link
              to="/dashboard/users/employees"
              className="text-blue-600 text-sm hover:underline"
            >
              See More
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Summary;
