import React from "react";
import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <div className="min-h-screen md:h-screen bg-white md:overflow-hidden md:grid md:grid-cols-2 ">
      {/* Left Panel */}
      <div className="hidden md:flex flex-col justify-between px-16 py-20 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-size-[40px_40px]">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight">
            Remote Work Tracker
          </h1>

          <p className="mt-6 text-gray-600 leading-relaxed max-w-md">
            A structured platform designed to simplify remote team coordination,
            time tracking, and task accountability.
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="space-y-6 text-sm text-gray-600">
          <div className="flex items-start gap-4">
            <div className="w-2 h-2 bg-black mt-2"></div>
            <p>Clear task ownership and deadlines</p>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-2 h-2 bg-black mt-2"></div>
            <p>Structured time logging system</p>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-2 h-2 bg-black mt-2"></div>
            <p>Centralized reporting visibility</p>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className=" flex flex-col md:overflow-y-auto md:justify-between px-6 py-12">
        {/* Form Area */}
        <div className="flex justify-center md:items-center flex-1">
          <div className="w-full max-w-md">
            <Outlet />
          </div>
        </div>

        {/* Minimal Footer */}
        <div className="text-center text-xs text-gray-500 mt-8">
          © {new Date().getFullYear()} Remote Work Tracker · Privacy · Terms
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
