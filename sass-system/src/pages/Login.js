import React, { useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("token/", {
        username,
        password,
      });

      localStorage.setItem("token", res.data.access);
      localStorage.setItem("role", res.data.user.role);
      localStorage.setItem("userid", res.data.user.id);

      navigate("/dashboard");
    } catch {
      alert("Invalid login");
    }
  };

  return (
    <div style={container}>
      <form style={card} onSubmit={login}>
        <h2>Task Management System</h2>

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

        <button style={button} type="submit">
          Login
        </button>
      </form>
    </div>
  );
}

const container = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  background: "#f1f5f9",
};

const card = {
  background: "#fff",
  padding: "40px",
  borderRadius: "8px",
  boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};

const input = {
  padding: "10px",
  border: "1px solid #ccc",
};

const button = {
  padding: "10px",
  background: "#2563eb",
  color: "#fff",
  border: "none",
};
