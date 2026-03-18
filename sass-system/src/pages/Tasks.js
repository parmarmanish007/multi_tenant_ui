import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../api/api";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function Tasks() {
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("userid");

  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const selectedProjectId = params.get("projectId");

  // ================= FETCH DATA =================

  const fetchTasks = async () => {
    try {
      const res = await api.get("tasks/");
      setTasks(res.data || []);
    } catch (err) {
      console.error("fetchTasks:", err);
      setTasks([]);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await api.get("projects/");
      setProjects(res.data || []);
    } catch (err) {
      console.error("fetchProjects:", err);
      setProjects([]);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get("users/");
      setUsers(res.data || []);
    } catch (err) {
      console.error("fetchUsers:", err);
      setUsers([]);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchProjects();
    fetchUsers();
  }, []);

  // ================= FORM (Formik) =================

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      project: selectedProjectId || "",
      assignedUser: "",
      dueDate: "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"),
      project: Yup.string().required("Please select a project"),
      // assignedUser: Yup.string().required("Please select an assigned user"),
      dueDate: Yup.string().required("Please select a due date"),
    }),
    enableReinitialize: true, // so selectedProjectId pre-fills project when query param present
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        const payload = {
          title: values.title.trim(),
          description: values.description || null,
          project: values.project,
          status: "Todo",
          assigned_to: values.assignedUser || (role === "Member" ? userId : null),
          due_date: values.dueDate || null,
        };

        await api.post("tasks/", payload);

        resetForm();
        fetchTasks();
      } catch (err) {
        console.error("create task error:", err);
        alert("Failed to create task");
      } finally {
        setSubmitting(false);
      }
    },
  });

  // ================= UPDATE STATUS =================

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`tasks/${id}/`, { status });
      fetchTasks();
    } catch (err) {
      console.error("updateStatus:", err);
      alert("Failed to update status");
    }
  };

  // ================= ROLE-BASED FILTER =================

  const filteredTasks = tasks.filter((task) => {
    // If project filter is selected via query param
    if (selectedProjectId) {
      const taskProjectId =
        task.project && (typeof task.project === "object" ? task.project.id : task.project);
      if (String(taskProjectId) !== String(selectedProjectId)) {
        return false;
      }
    }

    // ADMIN → see all tasks
    if (role === "Admin") {
      return true;
    }

    // MEMBER → see only assigned tasks
    return String(task.assigned_to) === String(userId);
  });

  // ================= GROUP LIKE JIRA =================

  const todoTasks = filteredTasks.filter((t) => t.status === "Todo");
  const inProgressTasks = filteredTasks.filter((t) => t.status === "In Progress");
  const doneTasks = filteredTasks.filter((t) => t.status === "Done");

  return (
    <div style={container}>
      <h2>📌 Tasks</h2>

      {/* ================= CREATE TASK (FORMIK) ================= */}
      <div style={card}>
        <h3>Create Task</h3>

        <form onSubmit={formik.handleSubmit}>
          <div style={formRow}>
            <input
              style={input}
              name="title"
              placeholder="Title"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />

            <textarea
              style={input}
              name="description"
              placeholder="Description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>

          {formik.touched.title && formik.errors.title && (
            <div style={{ color: "red", marginBottom: 8 }}>{formik.errors.title}</div>
          )}

          <div style={formRow}>
            <select
              style={input}
              name="project"
              value={formik.values.project}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <option value="">Select Project</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
             
            <select
              style={input}
              name="assignedUser"
              value={formik.values.assignedUser}
              onChange={formik.handleChange}
            >
              <option value="">
                Assign User {role === "Member" ? "(default: you)" : ""}
              </option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.username}
                </option>
              ))}
            </select>
          </div>

          {/* show project / assigned user errors on their own lines (prevents inline placement) */}
          {formik.touched.project && formik.errors.project && (
            <div style={{ color: "red", marginBottom: 8, width: "100%" }}>
              {formik.errors.project}
            </div>
          )}
          {/* {formik.touched.assignedUser && formik.errors.assignedUser && (
            <div style={{ color: "red", marginBottom: 8, width: "100%" }}>
              {formik.errors.assignedUser}
            </div>
          )} */}

          <div style={formRow}>
            <label style={{ alignSelf: "center", marginRight: 8 }}>Due Date</label>

            <div style={dateWrapper}>
              <span style={calendarIcon}>📅</span>

              <input
                type="date"
                name="dueDate"
                value={formik.values.dueDate}
                onChange={formik.handleChange}
                style={dateInput}
              />

              {formik.values.dueDate && (
                <button
                  type="button"
                  onClick={() => formik.setFieldValue("dueDate", "")}
                  style={clearButton}
                  title="Clear date"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* show due date error on its own line to avoid overlap */}
          {formik.touched.dueDate && formik.errors.dueDate && (
            <div style={{ color: "red", marginBottom: 8, width: "100%" }}>
              {formik.errors.dueDate}
            </div>
          )}

          <button style={button} type="submit" disabled={formik.isSubmitting}>
            ➕ Create Task
          </button>
        </form>
      </div>

      <hr />

      {/* ================= JIRA BOARD ================= */}
      <div style={board}>
        <div style={column}>
          <h3>🟡 Todo</h3>
          {todoTasks.map((task) => (
            <TaskCard key={task.id} task={task} updateStatus={updateStatus} users={users} />
          ))}
        </div>

        <div style={column}>
          <h3>🔵 In Progress</h3>
          {inProgressTasks.map((task) => (
            <TaskCard key={task.id} task={task} updateStatus={updateStatus} users={users} />
          ))}
        </div>

        <div style={column}>
          <h3>🟢 Done</h3>
          {doneTasks.map((task) => (
            <TaskCard key={task.id} task={task} updateStatus={updateStatus} users={users} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ================= TASK CARD ================= */

function TaskCard({ task, updateStatus, users }) {
  const assignedUser = users.find((u) => String(u.id) === String(task.assigned_to));

  // format due date if present
  const formattedDue =
    task.due_date && !isNaN(Date.parse(task.due_date))
      ? new Date(task.due_date).toLocaleDateString()
      : task.due_date || null;

  return (
    <div style={taskCard}>
      <h4>{task.title}</h4>

      <p>{task.description}</p>

      <p style={{ fontSize: "12px" }}>
        👤 {assignedUser ? assignedUser.username : "Unassigned"}
      </p>

      {formattedDue && <p style={{ fontSize: "12px", color: "#555" }}>📅 Due: {formattedDue}</p>}

      <select
        style={{ width: "100%", marginTop: "8px" }}
        value={task.status}
        onChange={(e) => updateStatus(task.id, e.target.value)}
      >
        <option value="Todo">Todo</option>
        <option value="In Progress">In Progress</option>
        <option value="Done">Done</option>
      </select>
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

const board = {
  display: "flex",
  gap: "20px",
};

const column = {
  flex: 1,
  background: "#ffffff",
  padding: "15px",
  borderRadius: "8px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  minHeight: "400px",
};

const taskCard = {
  background: "#f9fafb",
  padding: "10px",
  borderRadius: "6px",
  marginBottom: "10px",
  boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
};

const dateWrapper = {
  display: "flex",
  alignItems: "center",
  border: "1px solid #d1d5db",
  borderRadius: "6px",
  padding: "6px 10px",
  background: "#fff",
  maxWidth: "220px",
};

const calendarIcon = {
  marginRight: "6px",
  fontSize: "16px",
};

const dateInput = {
  border: "none",
  outline: "none",
  width: "100%",
  fontSize: "14px",
  background: "transparent",
};

const clearButton = {
  padding: "6px 8px",
  background: "#ef4444",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "14px",
  height: "36px",
};