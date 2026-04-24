import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/api/auth/register", form);
      login(data.token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <h1 style={styles.title}>Register</h1>
        {error ? <p style={styles.error}>{error}</p> : null}

        <label style={styles.label}>Name</label>
        <input
          type="text"
          name="name"
          required
          value={form.name}
          onChange={handleChange}
          style={styles.input}
        />

        <label style={styles.label}>Email</label>
        <input
          type="email"
          name="email"
          required
          value={form.email}
          onChange={handleChange}
          style={styles.input}
        />

        <label style={styles.label}>Password</label>
        <input
          type="password"
          name="password"
          required
          minLength={6}
          value={form.password}
          onChange={handleChange}
          style={styles.input}
        />

        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? "Creating account..." : "Register"}
        </button>

        <p style={styles.bottomText}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    background: "#f3f4f6",
  },
  card: {
    width: "100%",
    maxWidth: "420px",
    background: "#fff",
    borderRadius: "12px",
    padding: "24px",
    border: "1px solid #e5e7eb",
    boxSizing: "border-box",
  },
  title: {
    marginTop: 0,
    marginBottom: "14px",
  },
  error: {
    color: "#b91c1c",
    background: "#fee2e2",
    border: "1px solid #fecaca",
    borderRadius: "6px",
    padding: "8px",
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
  },
  button: {
    marginTop: "16px",
    width: "100%",
    border: "none",
    background: "#2563eb",
    color: "#fff",
    borderRadius: "6px",
    padding: "10px 12px",
    cursor: "pointer",
  },
  bottomText: {
    marginBottom: 0,
    marginTop: "12px",
    textAlign: "center",
  },
};
