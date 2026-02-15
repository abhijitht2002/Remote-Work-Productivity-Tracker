import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AuthLayout from "./Layout/AuthLayout";
import Login from "./components/Login";
import PublicLayout from "./Layout/PublicLayout";
import Register from "./components/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import Summary from "./pages/Summary";
import Managers from "./pages/Managers";
import Employees from "./pages/Employees";
import Notes from "./pages/Notes";
import DashboardLayout from "./Layout/DashboardLayout";
import Tasks from "./pages/Tasks";
import DashboardHome from "./pages/DashboardHome";
import TaskDetails from "./pages/TaskDetails";
import EmployeeTasks from "./pages/EmployeeTasks";
import EmployeeTaskDetail from "./pages/EmployeeTaskDetail";

function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<Home />} />
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<DashboardHome />} />

        <Route element={<ProtectedRoute roleRequired="ADMIN" />}>
          <Route path="summary" element={<Summary />} />
          <Route path="users/employees" element={<Employees />} />
          <Route path="users/managers" element={<Managers />} />
        </Route>

        <Route element={<ProtectedRoute roleRequired="MANAGER" />}>
          <Route path="tasks/assigned" element={<Tasks />} />
          <Route path="tasks/unassigned" element={<Tasks />} />
          <Route path="tasks/closed" element={<Tasks />} />
          <Route path="manager/task/:id" element={<TaskDetails />} />
        </Route>

        <Route element={<ProtectedRoute roleRequired="EMPLOYEE" />}>
          <Route path="tasks/upcoming" element={<EmployeeTasks />} />
          <Route path="tasks/due" element={<EmployeeTasks />} />
          <Route path="tasks/completed" element={<EmployeeTasks />} />
          <Route path="employee/task/:id" element={<EmployeeTaskDetail />} />
        </Route>

        <Route path="notes" element={<Notes />} />
        {/* <Route path="tasks" element={<Tasks />} /> */}
      </Route>
    </Routes>
  );
}

export default App;
