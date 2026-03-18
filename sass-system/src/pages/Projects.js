import React, { useEffect, useState } from "react";
import api from "../api/api";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [companies, setCompanies] = useState([]);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loader, setLoader] = useState(false);

  const userid = localStorage.getItem("userid");

  // ================= FETCH PROJECTS =================
  const fetchProjects = async () => {
    try {
      const res = await api.get("projects/");
      setProjects(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  // ================= FETCH COMPANIES =================
  const fetchCompanies = async () => {
    try {
      const res = await api.get("company/");
      setCompanies(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchCompanies();
  }, []);

  // ================= FORM (Formik + Yup) =================
  const formik = useFormik({
    initialValues: {
      name: "",
      company: ""
    },
    validationSchema: Yup.object({
      name: Yup.string().trim().required("Project name is required"),
      company: Yup.string().required("Company is required"),
    }),
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      setError("");
      setSuccess("");
      setLoader(true);

      try {
        const payload = {
          name: values.name.trim(),
          company: values.company,
          userid,
        };

        await api.post("projects/", payload);

        setSuccess("Project created successfully ✅");
        resetForm();
        fetchProjects();
      } catch (err) {
        console.error("create project error:", err);
        setError("Failed to create project");
      } finally {
        setLoader(false);
        setSubmitting(false);
      }
    },
  });

  return (
    <div style={container}>
      <h2>📁 Projects</h2>

      {/* ================= ERROR / SUCCESS MESSAGE ================= */}
      {error && <div style={errorBox}>❌ {error}</div>}
      {success && <div style={successBox}>{success}</div>}

      {/* ================= CREATE PROJECT CARD ================= */}
      <div style={card}>
        <h3>Create Project</h3>

        <form onSubmit={formik.handleSubmit}>
          <div style={formRow}>
            <input
              style={input}
              name="name"
              value={formik.values.name}
              placeholder="Project Name"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />

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

          {formik.touched.name && formik.errors.name && (
            <div style={{ color: "red", marginBottom: 8 }}>{formik.errors.name}</div>
          )}

          {formik.touched.company && formik.errors.company && (
            <div style={{ color: "red", marginBottom: 8 }}>{formik.errors.company}</div>
          )}
          <button style={button} type="submit" disabled={formik.isSubmitting || loader}>
            {loader ? "Creating..." : "➕ Create Project"}
          </button>
        </form>
      </div>

      <hr />

      {/* ================= PROJECT LIST ================= */}
      <h3>📋 Project List</h3>

      <div style={tableCard}>
        <table style={table}>
          <thead>
            <tr>
              <th style={th}>ID</th>
              <th style={th}>Project Name</th>
              <th style={th}>Company Name</th>
              <th style={th}>Action</th>
            </tr>
          </thead>

          <tbody>
            {projects.length > 0 ? (
              projects.map((p) => (
                <tr key={p.id}>
                  <td style={td}>{p.id}</td>

                  <td style={td}>
                    <Link to={`/tasks?projectId=${p.id}`} style={link}>
                      {p.name}
                    </Link>
                  </td>

                  <td style={td}>
                    {companies.find((c) => c.id === p.company)?.name || "-"}
                  </td>

                  <td style={td}>
                    <Link to={`/tasks?projectId=${p.id}`} style={buttonSmall}>
                      View Tasks
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td style={td} colSpan="4" align="center">
                  No projects found
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

const link = {
  textDecoration: "none",
  color: "#2563eb",
  fontWeight: "500",
};

const buttonSmall = {
  padding: "6px 10px",
  background: "#10b981",
  color: "#fff",
  borderRadius: "4px",
  textDecoration: "none",
  fontSize: "12px",
};
