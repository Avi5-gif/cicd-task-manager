import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

const initialForm = {
  title: "",
  description: "",
  status: "pending",
  priority: "medium",
  dueDate: "",
};

export default function TaskFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = useMemo(() => Boolean(id), [id]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEditMode) return;

    const loadTask = async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await api.get(`/api/tasks/${id}`);
        setForm({
          title: data.title || "",
          description: data.description || "",
          status: data.status || "pending",
          priority: data.priority || "medium",
          dueDate: data.dueDate ? new Date(data.dueDate).toISOString().split("T")[0] : "",
        });
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load task");
      } finally {
        setLoading(false);
      }
    };

    loadTask();
  }, [id, isEditMode]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const payload = {
        ...form,
        dueDate: form.dueDate || null,
      };

      if (isEditMode) {
        await api.put(`/api/tasks/${id}`, payload);
      } else {
        await api.post("/api/tasks", payload);
      }
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save task");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p style={{ padding: "20px" }}>Loading task...</p>;
  }

  return (
    <div style={styles.page}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <div style={styles.topRow}>
          <h1 style={{ margin: 0 }}>{isEditMode ? "Edit Task" : "Create Task"}</h1>
          <Link to="/" style={styles.backLink}>
            Back
          </Link>
        </div>

        {error ? <p style={styles.error}>{error}</p> : null}

        <label style={styles.label}>Title</label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <label style={styles.label}>Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={4}
          style={{ ...styles.input, resize: "vertical" }}
        />

        <div style={styles.row}>
          <div style={styles.field}>
            <label style={styles.label}>Status</label>
            <select name="status" value={form.status} onChange={handleChange} style={styles.input}>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Priority</label>
            <select
              name="priority"
              value={form.priority}
              onChange={handleChange}
              style={styles.input}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <label style={styles.label}>Due Date</label>
        <input
          type="date"
          name="dueDate"
          value={form.dueDate}
          onChange={handleChange}
          style={styles.input}
        />

        <button type="submit" disabled={saving} style={styles.submitBtn}>
          {saving ? "Saving..." : isEditMode ? "Update Task" : "Create Task"}
        </button>
      </form>
    </div>
  );
}

const styles = {
  page: {
    maxWidth: "760px",
    margin: "20px auto",
    padding: "0 16px",
  },
  card: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "20px",
  },
  topRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
  },
  backLink: {
    textDecoration: "none",
    color: "#2563eb",
    fontSize: "14px",
  },
  error: {
    color: "#b91c1c",
    background: "#fee2e2",
    border: "1px solid #fecaca",
    borderRadius: "6px",
    padding: "8px",
  },
  row: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  },
  field: {
    flex: 1,
    minWidth: "180px",
  },
  label: {
    display: "block",
    marginTop: "12px",
    marginBottom: "6px",
    fontSize: "14px",
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    padding: "10px",
    background: "#fff",
  },
  submitBtn: {
    marginTop: "16px",
    border: "none",
    background: "#2563eb",
    color: "#fff",
    borderRadius: "6px",
    padding: "10px 14px",
    cursor: "pointer",
  },
};
