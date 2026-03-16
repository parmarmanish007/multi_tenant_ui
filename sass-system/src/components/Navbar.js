import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div style={navbarStyle}>
      <div>
        <Link style={linkStyle} to="/dashboard">
          Dashboard
        </Link>

        {/* ✅ ADMIN LINKS */}
        {role === "Admin" && (
          <>
            <Link style={linkStyle} to="/company">
              Company
            </Link>

            <Link style={linkStyle} to="/users">
              Users
            </Link>

            <Link style={linkStyle} to="/projects">
              Projects
            </Link>
          </>
        )}

        {/* ✅ MEMBER LINKS */}
        {role === "Member" && (
          <Link style={linkStyle} to="/tasks">
            Tasks
          </Link>
        )}
      </div>

      <button onClick={logout} style={btnStyle}>
        Logout
      </button>
    </div>
  );
}

const navbarStyle = {
  background: "#1e293b",
  padding: "15px",
  color: "#fff",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const linkStyle = {
  color: "#fff",
  marginRight: "20px",
  textDecoration: "none",
};

const btnStyle = {
  background: "#ef4444",
  border: "none",
  color: "#fff",
  padding: "6px 12px",
  cursor: "pointer",
  borderRadius: "4px",
};
