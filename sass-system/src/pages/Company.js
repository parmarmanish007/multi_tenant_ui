import React, { useEffect, useState } from "react";
import api from "../api/api";

export default function Company() {
  const [companies, setCompanies] = useState([]);

  const [name, setName] = useState("");
  const [editId, setEditId] = useState(null);

  // =========================
  // FETCH COMPANIES
  // =========================
  const getCompanies = async () => {
    try {
      const res = await api.get("company/");
      setCompanies(res.data || []);
    } catch (error) {
      console.error("Failed to fetch company:", error);
    }
  };

  useEffect(() => {
    getCompanies();
  }, []);

  // =========================
  // CREATE COMPANY
  // =========================
  const createCompany = async () => {
    if (!name) {
      alert("Please enter company name");
      return;
    }

    try {
      await api.post("company/", {
        name: name,
      });

      setName("");
      getCompanies();
    } catch (error) {
      console.error(error);
      alert("Failed to create company");
    }
  };

  // =========================
  // EDIT COMPANY (LOAD DATA)
  // =========================
  const startEdit = (company) => {
    setEditId(company.id);
    setName(company.name);
  };

  // =========================
  // UPDATE COMPANY
  // =========================
  const updateCompany = async () => {
    try {
      await api.put(`company/${editId}/`, {
        name: name,
      });

      setEditId(null);
      setName("");
      getCompanies();
    } catch (error) {
      console.error(error);
      alert("Failed to update company");
    }
  };

  // =========================
  // DELETE COMPANY
  // =========================
  const deleteCompany = async (id) => {
    if (!window.confirm("Are you sure to delete this company?")) return;

    try {
      await api.delete(`company/${id}/`);
      getCompanies();
    } catch (error) {
      console.error(error);
      alert("Failed to delete company");
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>Company Management</h2>

      <hr />

      {/* ================= CREATE / EDIT FORM ================= */}

      <div style={formStyle}>
        <h3>{editId ? "Update Company" : "Create Company"}</h3>

        <input
          style={inputStyle}
          placeholder="Company Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {editId ? (
          <button style={buttonStyle} onClick={updateCompany}>
            Update
          </button>
        ) : (
          <button style={buttonStyle} onClick={createCompany}>
            Create
          </button>
        )}

        {editId && (
          <button
            style={{ ...buttonStyle, background: "#6b7280" }}
            onClick={() => {
              setEditId(null);
              setName("");
            }}
          >
            Cancel
          </button>
        )}
      </div>

      <hr />

      {/* ================= COMPANY LIST ================= */}

      <h3>Company List</h3>

      <table border="1" cellPadding="10" width="100%">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Created Date</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {companies.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.name}</td>
              <td>
                {c.created_at
                  ? new Date(c.created_at).toLocaleDateString()
                  : "-"}
              </td>

              <td>
                <button
                  style={{ marginRight: "10px" }}
                  onClick={() => startEdit(c)}
                >
                  Edit
                </button>

                <button
                  style={{ background: "red", color: "#fff" }}
                  onClick={() => deleteCompany(c.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ================= STYLES =================

const formStyle = {
  marginBottom: "20px",
  padding: "20px",
  border: "1px solid #ddd",
  borderRadius: "6px",
  background: "#f9fafb",
};

const inputStyle = {
  padding: "8px",
  marginRight: "10px",
};

const buttonStyle = {
  padding: "8px 12px",
  background: "#2563eb",
  color: "#fff",
  border: "none",
  cursor: "pointer",
  marginRight: "5px",
};
