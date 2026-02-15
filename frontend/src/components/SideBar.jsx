import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

function SideBar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState([]);

  const getTaskTypeFromPath = () => {
    if (location.pathname.includes("assigned")) return "assigned";
    if (location.pathname.includes("unassigned")) return "unassigned";
    if (location.pathname.includes("closed")) return "closed";
    return "";
  };

  useEffect(() => {
    const fetchSearch = async () => {
      if (!searchText.trim()) {
        setSearchResults([]);
        return;
      }

      try {
        const res = await api.get("/api/manager/search", {
          params: { query: searchText }, // must match backend
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setSearchResults(res.data.tasks || []); // 🔥 FIXED
      } catch (err) {
        console.error("Search error:", err);
        setSearchResults([]); // safety fallback
      }
    };

    const timer = setTimeout(fetchSearch, 400);
    return () => clearTimeout(timer);
  }, [searchText]);

  const linksByRole = {
    ADMIN: [
      { name: "Summary", path: "/dashboard/summary" },
      {
        name: "Users",
        children: [
          { name: "Employees", path: "/dashboard/users/employees" },
          { name: "Managers", path: "/dashboard/users/managers" },
        ],
      },
      {
        name: "Tools",
        children: [{ name: "Notes", path: "/dashboard/notes" }],
      },
    ],
    MANAGER: [
      {
        name: "Tasks",
        children: [
          { name: "Assigned", path: "/dashboard/tasks/assigned" },
          { name: "Unassigned", path: "/dashboard/tasks/unassigned" },
          { name: "Closed", path: "/dashboard/tasks/closed" },
        ],
      },
      {
        name: "Tools",
        children: [{ name: "Notes", path: "/dashboard/notes" }],
      },
    ],
    EMPLOYEE: [
      {
        name: "Tasks",
        children: [
          { name: "Upcoming", path: "/dashboard/tasks/upcoming" },
          { name: "Due", path: "/dashboard/tasks/due" },
          { name: "Completed", path: "/dashboard/tasks/completed" },
        ],
      },
      {
        name: "Tools",
        children: [{ name: "Notes", path: "/dashboard/notes" }],
      },
    ],
  };

  const links = linksByRole[user?.role] || [];

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-20 z-20 md:hidden transition-opacity ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      ></div>

      {/* Sidebar */}
      <aside
        className={`fixed md:static left-0 top-0 h-full w-64 bg-white shadow-md flex flex-col justify-between transform transition-transform z-30
      ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Mobile Header */}
        <div className="md:hidden p-4 flex justify-start items-center border-b border-gray-200 gap-4">
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-600 hover:text-gray-900 p-1 rounded"
          >
            ✕
          </button>
          <span className="font-bold text-lg">Menu</span>
        </div>

        {/* Search bar  */}
        {(user?.role === "MANAGER" || user?.role === "EMPLOYEE") && (
          <div className="p-4 border-b border-gray-200">
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full px-3 py-2 rounded border border-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {searchText && (
              <div className="mt-2 bg-white border border-gray-300 rounded shadow-sm max-h-60 overflow-y-auto">
                {searchResults.length === 0 ? (
                  <div className="p-2 text-gray-500 text-sm">
                    No tasks found
                  </div>
                ) : (
                  searchResults.map((task) => (
                    <div
                      key={task._id}
                      onClick={() => {
                        navigate(`/dashboard/task/${task._id}`);
                        setSearchText("");
                        setIsOpen(false);
                      }}
                      className="p-2 text-sm hover:bg-gray-100 cursor-pointer"
                    >
                      <div className="font-medium text-gray-800">
                        {task.title}
                      </div>
                      <div className="text-xs text-gray-500">
                        {task.assigned_to?.name || "Unassigned"}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-6 py-4 space-y-4 overflow-y-auto">
          {links.map((link) =>
            link.children ? (
              <div key={link.name}>
                <div className="text-gray-400 font-semibold uppercase text-xs mb-2">
                  {link.name}
                </div>
                <div className="ml-4 flex flex-col gap-1">
                  {link.children.map((child) => {
                    const active = location.pathname === child.path;
                    return (
                      <Link
                        key={child.name}
                        to={child.path}
                        className={`px-3 py-1 rounded transition-colors text-sm ${
                          active
                            ? "bg-blue-100 font-medium text-blue-700"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {child.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ) : (
              <Link
                key={link.name}
                to={link.path}
                className={`block px-3 py-2 rounded text-sm transition-colors ${
                  location.pathname === link.path
                    ? "bg-blue-100 font-medium text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {link.name}
              </Link>
            ),
          )}
        </nav>

        {/* Logout */}
        <div className="px-6 py-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="text-gray-500 hover:text-red-500 text-sm transition"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Hamburger */}
      <button
        className="md:hidden fixed top-4 left-4 z-40 p-2 bg-white rounded shadow hover:bg-gray-100 transition"
        onClick={() => setIsOpen(true)}
      >
        ☰
      </button>
    </>
  );
}

export default SideBar;
