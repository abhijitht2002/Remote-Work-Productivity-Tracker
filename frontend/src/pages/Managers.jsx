import React, { useEffect, useState } from "react";
import { createManager, listManagers } from "../api/api";

function Managers() {
  const [managers, setManagers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [creating, setCreating] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const fetchManagers = async () => {
    try {
      const data = await listManagers(page);
      setManagers(data.docs || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("Error fetching managers:", err);
      setManagers([]);
    }
  };

  useEffect(() => {
    fetchManagers();
  }, [page]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const addManager = async () => {
    if (!formData.name || !formData.email || !formData.password) {
      console.log("Form incomplete:", formData);
      return;
    }

    console.log("Sending data:", formData);
    try {
      setCreating(true);
      await createManager(formData);

      // Reset form correctly
      setFormData({
        name: "",
        email: "",
        password: "",
      });

      // Refresh list from backend (correct approach)
      await fetchManagers();
    } catch (err) {
      console.error("Error creating manager:", err);
    } finally {
      setCreating(false);
    }
  };

  const deleteManager = async (id) => {
    // TODO: connect delete API later
    setManagers((prev) => prev.filter((m) => m._id !== id));
  };

  return (
    <div className="bg-gray-50 p-4 sm:p-6 rounded-lg">
      {/* Header */}
      <div className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
        Managers Management
      </div>

      {/* Create Manager */}
      <div className="bg-white border border-gray-200 rounded-md p-4 sm:p-5 shadow-sm">
        <div className="text-sm font-medium text-gray-700 mb-3">
          Create New Manager
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            addManager();
          }}
          className="flex flex-col lg:flex-row gap-3"
        >
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full"
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full"
          />
          <button
            type="submit"
            disabled={creating}
            className="bg-blue-600 text-white text-sm px-5 py-2 rounded-md hover:bg-blue-700 transition font-medium w-full lg:w-auto disabled:opacity-50"
          >
            {creating ? "Creating..." : "Add Manager"}
          </button>
        </form>
      </div>

      {/* Divider */}
      <div className="my-5 border-t border-gray-200"></div>

      {/* Table */}
      <div className="hidden md:block bg-white border border-gray-200 rounded-md shadow-sm overflow-hidden">
        <div className="grid grid-cols-5 bg-gray-100 text-gray-600 text-sm font-medium px-4 py-3 border-b">
          <div>Name</div>
          <div>Email</div>
          <div>Employees</div>
          <div>Tasks</div>
          <div className="text-right">Actions</div>
        </div>

        {managers.length === 0 ? (
          <div className="text-center py-6 text-gray-500 text-sm">
            No managers found
          </div>
        ) : (
          managers.map((manager) => (
            <div
              key={manager._id}
              className="grid grid-cols-5 px-4 py-3 text-sm border-b hover:bg-gray-50"
            >
              <div className="font-medium text-gray-800">{manager.name}</div>
              <div className="text-gray-600 truncate">{manager.email}</div>
              <div className="text-gray-600">
                {manager.employeesAssigned || 0}
              </div>
              <div className="text-gray-600">{manager.tasksCreated || 0}</div>
              <div className="text-right">
                <button
                  onClick={() => deleteManager(manager._id)}
                  className="text-red-500 hover:text-red-700 font-medium"
                >
                  Delete
                </button>
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

export default Managers;
