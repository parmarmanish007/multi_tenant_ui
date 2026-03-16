import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Projects from "./pages/Projects";
import Tasks from "./pages/Tasks";
import Company from "./pages/Company";
import Navbar from "./components/Navbar";

function RequireRole({ allowed, children }) {
  const role = localStorage.getItem("role");

  return allowed.includes(role) ? children : <Navigate to="/dashboard" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route
          path="/company"
          element={
            <RequireRole allowed={["Admin"]}>
              <Company />
            </RequireRole>
          }
        />

        <Route
          path="/users"
          element={
            <RequireRole allowed={["Admin"]}>
              <Users />
            </RequireRole>
          }
        />

        <Route
          path="/projects"
          element={
            <RequireRole allowed={["Admin"]}>
              <Projects />
            </RequireRole>
          }
        />

        <Route
          path="/tasks"
          element={
            <RequireRole allowed={["Member", "Admin"]}>
              <Tasks />
            </RequireRole>
          }
        />

        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}
