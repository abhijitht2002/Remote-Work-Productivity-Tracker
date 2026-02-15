import React, { useEffect, useState } from "react";
import { listEmployees } from "../api/api";

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchEmployees = async () => {
    try {
      const data = await listEmployees(page);
      setEmployees(data.docs || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("Error fetching employees:", err);
      setEmployees([]);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [page]);

  return (
    <div className="bg-gray-50 p-4 sm:p-6 rounded-lg mt-6">
      {/* Header */}
      <div className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
        Employees
      </div>

      {/* Desktop / Tablet Table */}
      <div className="hidden md:block bg-white border border-gray-200 rounded-md shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-4 bg-gray-100 text-gray-600 text-sm font-medium px-4 py-3 border-b">
          <div>Name</div>
          <div>Tasks</div>
          <div>Completed</div>
          <div>Total Time</div>
        </div>

        {/* Table Body */}
        {employees.length === 0 ? (
          <div className="text-center py-6 text-gray-500 text-sm">
            No employees found
          </div>
        ) : (
          employees.map((emp) => (
            <div
              key={emp._id}
              className="grid grid-cols-4 px-4 py-3 text-sm border-b hover:bg-gray-50 transition"
            >
              <div className="font-medium text-gray-800">{emp.name}</div>
              <div className="text-gray-600">{emp.tasks || 0}</div>
              <div className="text-gray-600">{emp.completed || 0}</div>
              <div className="text-gray-600">{emp.workTime || "0h"}</div>
            </div>
          ))
        )}
      </div>

      {/* Mobile Card List */}
      <div className="md:hidden space-y-3">
        {employees.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-md p-4 text-center text-gray-500 text-sm">
            No employees found
          </div>
        ) : (
          employees.map((emp) => (
            <div
              key={emp._id}
              className="bg-white border border-gray-200 rounded-md p-4 shadow-sm"
            >
              <div className="font-semibold text-gray-800">{emp.name}</div>

              <div className="flex flex-wrap gap-2 mt-3 text-xs text-gray-600">
                <div className="bg-gray-100 px-2 py-1 rounded">
                  Tasks: {emp.tasks || 0}
                </div>
                <div className="bg-gray-100 px-2 py-1 rounded">
                  Completed: {emp.completed || 0}
                </div>
                <div className="bg-gray-100 px-2 py-1 rounded">
                  Time: {emp.workTime || "0h"}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Responsive Pagination */}
      <div className="flex flex-col sm:flex-row justify-end items-center gap-2 mt-4 text-sm">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50"
        >
          Prev
        </button>

        <span className="text-gray-700 font-medium">
          Page {page} / {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Employees;
