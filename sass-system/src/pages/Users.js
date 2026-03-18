import React, { useEffect, useState } from "react";
import api from "../api/api";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);

  const [error, setError] = useState(""); // 🔴 Error state
  const [success, setSuccess] = useState(""); // 🟢 Success message
  const [loader, setLoader] = useState(false);

  // ================= FETCH USERS =================
  const fetchUsers = async () => {
    try {
      const res = await api.get("users/");
      setUsers(res.data || []);
    } catch (err) {
      setUsers([]);
      console.error("fetchUsers:", err);
    }
  };

  // ================= FETCH COMPANIES =================
  const fetchCompanies = async () => {
    try {
      const res = await api.get("company/");
      setCompanies(res.data || []);
    } catch (err) {
      setCompanies([]);
      console.error("fetchCompanies:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchCompanies();
  }, []);

  // ================= FORM (Formik + Yup) =================
  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      role: "Member",
      company: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().trim().required("Username is required"),
      password: Yup.string().trim().required("Password is required"),
      role: Yup.string().required("Role is required"),
      company: Yup.string().required("Company is required"),
    }),
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      setError("");
      setSuccess("");
      setLoader(true);

      try {
        const payload = {
          username: values.username.trim(),
          password: values.password,
          role: values.role,
          company: values.company,
        };

        await api.post("users/", payload);

        setSuccess("User created successfully ✅");
        resetForm();
        fetchUsers();
      } catch (err) {
        console.error("create user error:", err);
        setError("Error creating user");
      } finally {
        setLoader(false);
        setSubmitting(false);
      }
    },
  });

  return (
    <div style={container}>
      <h2>👥 Users</h2>

      {/* ================= ERROR / SUCCESS MESSAGE ================= */}

      {error && <div style={errorBox}>❌ {error}</div>}

      {success && <div style={successBox}>{success}</div>}

      {/* ================= CREATE USER CARD ================= */}

      <div style={card}>
        <h3>Create User</h3>

        <form onSubmit={formik.handleSubmit}>
          <div style={formRow}>
            <input
              style={input}
              name="username"
              placeholder="Username"
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />

            <input
              style={input}
              type="password"
              name="password"
              placeholder="Password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>

          {formik.touched.username && formik.errors.username && (
            <div style={{ color: "red", marginBottom: 8 }}>{formik.errors.username}</div>
          )}
          {formik.touched.password && formik.errors.password && (
            <div style={{ color: "red", marginBottom: 8 }}>{formik.errors.password}</div>
          )}

          <div style={formRow}>
            <select
              style={input}
              name="role"
              value={formik.values.role}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <option value="">Select Role</option>
              <option value="Admin">Admin</option>
              <option value="Member">Member</option>
            </select>

            <select
              style={input}
              name="company"
              value={formik.values.company}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <option value="">Select Company</option>

              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {formik.touched.role && formik.errors.role && (
            <div style={{ color: "red", marginBottom: 8 }}>{formik.errors.role}</div>
          )}
          {formik.touched.company && formik.errors.company && (
            <div style={{ color: "red", marginBottom: 8 }}>{formik.errors.company}</div>
          )}

          <button style={button} type="submit" disabled={formik.isSubmitting || loader}>
            {loader ? "Creating..." : "➕ Create User"}
          </button>
        </form>
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
