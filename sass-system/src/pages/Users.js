import React, { useEffect, useState } from "react";
import api from "../api/api";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Member");
  const [company, setCompany] = useState("");

  const [error, setError] = useState(""); // 🔴 Error state
  const [success, setSuccess] = useState(""); // 🟢 Success message

  // ================= FETCH USERS =================
  const fetchUsers = async () => {
    const res = await api.get("users/");
    setUsers(res.data || []);
  };

  // ================= FETCH COMPANIES =================
  const fetchCompanies = async () => {
    const res = await api.get("company/");
    setCompanies(res.data || []);
  };

  useEffect(() => {
    fetchUsers();
    fetchCompanies();
  }, []);

  // ================= CREATE USER WITH VALIDATION =================
  const createUser = async () => {
    setError("");
    setSuccess("");

    // 🔴 Validation
    if (!username.trim()) {
      setError("Username is required");
      return;
    }

    if (!password.trim()) {
      setError("Password is required");
      return;
    }

    if (!role) {
      setError("Role is required");
      return;
    }

    if (!company) {
      setError("Company is required");
      return;
    }

    try {
      await api.post("users/", {
        username,
        password,
        role,
        company,
      });

      setSuccess("User created successfully ✅");

      // Reset fields
      setUsername("");
      setPassword("");
      setRole("Member");
      setCompany("");

      fetchUsers();
    } catch (err) {
      setError("Error creating user");
    }
  };

  return (
    <div style={container}>
      <h2>👥 Users</h2>

      {/* ================= ERROR / SUCCESS MESSAGE ================= */}

      {error && <div style={errorBox}>❌ {error}</div>}

      {success && <div style={successBox}>{success}</div>}

      {/* ================= CREATE USER CARD ================= */}

      <div style={card}>
        <h3>Create User</h3>

        <div style={formRow}>
          <input
            style={input}
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            style={input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div style={formRow}>
          <select
            style={input}
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="">Select Role</option>
            <option value="Admin">Admin</option>
            <option value="Member">Member</option>
          </select>

          <select
            style={input}
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          >
            <option value="">Select Company</option>

            {companies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <button style={button} onClick={createUser}>
          ➕ Create User
        </button>
      </div>

      <hr />

      {/* ================= USER LIST ================= */}

      <h3>📋 User List</h3>

      <div style={tableCard}>
        <table style={table}>
          <thead>
            <tr>
              <th style={th}>ID</th>
              <th style={th}>Username</th>
              <th style={th}>Role</th>
              <th style={th}>Company</th>
            </tr>
          </thead>

          <tbody>
            {users.length > 0 ? (
              users.map((u) => (
                <tr key={u.id}>
                  <td style={td}>{u.id}</td>
                  <td style={td}>{u.username}</td>
                  <td style={td}>
                    <span style={roleBadge}>{u.role}</span>
                  </td>
                  <td style={td}>
                    {companies.find((c) => c.id === u.company)?.name || "-"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td style={td} colSpan="4" align="center">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const container = {
  padding: "30px",
  background: "#f8fafc",
  minHeight: "100vh",
};

const card = {
  background: "#fff",
  padding: "20px",
  borderRadius: "8px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  marginBottom: "20px",
};

const formRow = {
  display: "flex",
  gap: "10px",
  marginBottom: "10px",
  flexWrap: "wrap",
};

const input = {
  padding: "8px",
  border: "1px solid #d1d5db",
  borderRadius: "4px",
  flex: "1",
};

const button = {
  padding: "8px 14px",
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

const errorBox = {
  background: "#fee2e2",
  color: "#b91c1c",
  padding: "10px",
  borderRadius: "6px",
  marginBottom: "10px",
};

const successBox = {
  background: "#dcfce7",
  color: "#166534",
  padding: "10px",
  borderRadius: "6px",
  marginBottom: "10px",
};

const tableCard = {
  background: "#fff",
  padding: "15px",
  borderRadius: "8px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
};

const th = {
  padding: "10px",
  border: "1px solid #e5e7eb",
  textAlign: "left",
  background: "#f9fafb",
  fontWeight: "600",
};

const td = {
  padding: "10px",
  border: "1px solid #e5e7eb",
};

const roleBadge = {
  padding: "4px 8px",
  background: "#e0f2fe",
  borderRadius: "4px",
  fontSize: "12px",
};
