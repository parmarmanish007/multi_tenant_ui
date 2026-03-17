import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../api/api";

export default function Tasks() {
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("userid");

  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [project, setProject] = useState("");
  const [assignedUser, setAssignedUser] = useState("");
  const [dueDate, setDueDate] = useState(""); // <-- added dueDate state

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const selectedProjectId = params.get("projectId");

  // ================= FETCH DATA =================

  const fetchTasks = async () => {
    const res = await api.get("tasks/");
    setTasks(res.data || []);
  };

  const fetchProjects = async () => {
    const res = await api.get("projects/");
    setProjects(res.data || []);
  };

  const fetchUsers = async () => {
    const res = await api.get("users/");
    setUsers(res.data || []);
  };

  useEffect(() => {
    fetchTasks();
    fetchProjects();
    fetchUsers();
  }, []);

  // ================= CREATE TASK =================

  const createTask = async () => {
    await api.post("tasks/", {
      title,
      description,
      project,
      status: "Todo",
      assigned_to: assignedUser,
      due_date: dueDate || null,
    });

    setTitle("");
    setDescription("");
    setProject("");
    setAssignedUser("");
    setDueDate("");

    fetchTasks();
  };

  // ================= UPDATE STATUS =================

  const updateStatus = async (id, status) => {
    await api.patch(`tasks/${id}/`, { status });
    fetchTasks();
  };

  // ================= ROLE-BASED FILTER =================

  const filteredTasks = tasks.filter((task) => {
    // If project filter is selected
    if (selectedProjectId) {
      if (String(task.project) !== String(selectedProjectId)) {
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
  const inProgressTasks = filteredTasks.filter(
    (t) => t.status === "In Progress",
  );
  const doneTasks = filteredTasks.filter((t) => t.status === "Done");

  return (
    <div style={container}>
      <h2>📌 Tasks</h2>

      {/* ================= CREATE TASK (ADMIN + MEMBER) ================= */}

      <div style={card}>
        <h3>Create Task</h3>

        <div style={formRow}>
          <input
            style={input}
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            style={input}
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div style={formRow}>
          <select
            style={input}
            value={project}
            onChange={(e) => setProject(e.target.value)}
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
            value={assignedUser}
            onChange={(e) => setAssignedUser(e.target.value)}
          >
            <option value="">Assign User</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.username}
              </option>
            ))}
          </select>
        </div>

        <div style={formRow}>
  <label style={{ alignSelf: "center", marginRight: 8 }}>Due Date</label>

  <div style={dateWrapper}>
    <span style={calendarIcon}>📅</span>

    <input
      type="date"
      value={dueDate}
      onChange={(e) => setDueDate(e.target.value)}
      style={dateInput}
    />
  </div>
</div>

        <button style={button} onClick={createTask}>
          ➕ Create Task
        </button>
      </div>

      <hr />

      {/* ================= JIRA BOARD ================= */}

      <div style={board}>
        {/* TODO */}
        <div style={column}>
          <h3>🟡 Todo</h3>
          {todoTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              updateStatus={updateStatus}
              users={users}
            />
          ))}
        </div>

        {/* IN PROGRESS */}
        <div style={column}>
          <h3>🔵 In Progress</h3>
          {inProgressTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              updateStatus={updateStatus}
              users={users}
            />
          ))}
        </div>

        {/* DONE */}
        <div style={column}>
          <h3>🟢 Done</h3>
          {doneTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              updateStatus={updateStatus}
              users={users}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ================= TASK CARD ================= */

function TaskCard({ task, updateStatus, users }) {
  const assignedUser = users.find((u) => u.id === task.assigned_to);

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

      {formattedDue && (
        <p style={{ fontSize: "12px", color: "#555" }}>
          📅 Due: {formattedDue}
        </p>
      )}

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