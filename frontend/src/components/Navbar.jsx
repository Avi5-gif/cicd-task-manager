import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.brand}>
        Task Manager
      </Link>
      <div style={styles.links}>
        <Link to="/" style={styles.link}>
          Dashboard
        </Link>
        <Link to="/tasks/new" style={styles.link}>
          New Task
        </Link>
        <button onClick={handleLogout} style={styles.logoutButton}>
          Logout
        </button>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    background: "#111827",
    color: "#fff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 20px",
  },
  brand: {
    color: "#fff",
    textDecoration: "none",
    fontWeight: 700,
    fontSize: "18px",
  },
  links: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  link: {
    color: "#e5e7eb",
    textDecoration: "none",
    fontSize: "14px",
  },
  logoutButton: {
    border: "1px solid #374151",
    background: "#1f2937",
    color: "#fff",
    padding: "8px 12px",
    borderRadius: "6px",
    cursor: "pointer",
  },
};
