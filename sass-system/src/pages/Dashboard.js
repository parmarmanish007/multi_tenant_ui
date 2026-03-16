import React from "react";

export default function Dashboard() {
  const role = localStorage.getItem("role");

  return (
    <div style={{ padding: "30px" }}>
      <h2>Dashboard</h2>

      <hr />

      {role === "Admin" && (
        <div>
          <h3>Admin Panel</h3>

          <p>Manage companies, users and projects.</p>
        </div>
      )}

      {role === "Member" && (
        <div>
          <h3>User Panel</h3>

          <p>View and manage your assigned tasks.</p>
        </div>
      )}
    </div>
  );
}
