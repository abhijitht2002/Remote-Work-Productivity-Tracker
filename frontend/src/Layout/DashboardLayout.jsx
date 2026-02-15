import React from "react";
import { Outlet } from "react-router-dom";
import SideBar from "../components/SideBar";

function DashboardLayout() {
  return (
    <div className="flex h-screen bg-gray-50">
      <SideBar />
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;
