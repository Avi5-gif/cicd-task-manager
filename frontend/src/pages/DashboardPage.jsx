import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import FilterBar from "../components/FilterBar";
import TaskCard from "../components/TaskCard";
import api from "../services/api";

export default function DashboardPage() {
  const [tasks, setTasks] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/api/tasks");
      setTasks(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const statusOk = statusFilter === "all" || task.status === statusFilter;
      const priorityOk = priorityFilter === "all" || task.priority === priorityFilter;
      return statusOk && priorityOk;
    });
  }, [tasks, statusFilter, priorityFilter]);

  const deleteTask = async (id) => {
    try {
      await api.delete(`/api/tasks/${id}`);
      setTasks((prev) => prev.filter((task) => task._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete task");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.headerRow}>
        <h1 style={styles.title}>Your Tasks</h1>
        <Link to="/tasks/new" style={styles.newButton}>
          + New Task
        </Link>
      </div>

      <FilterBar
        statusFilter={statusFilter}
        priorityFilter={priorityFilter}
        onStatusChange={setStatusFilter}
        onPriorityChange={setPriorityFilter}
      />

      {error ? <p style={styles.error}>{error}</p> : null}

      {loading ? <p>Loading tasks...</p> : null}

      {!loading && filteredTasks.length === 0 ? (
        <div style={styles.emptyState}>
          <p style={{ margin: 0 }}>No tasks found for this filter.</p>
        </div>
      ) : null}

      <div style={styles.grid}>
        {filteredTasks.map((task) => (
          <TaskCard key={task._id} task={task} onDelete={deleteTask} />
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "960px",
    margin: "20px auto",
    padding: "0 16px",
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
    gap: "12px",
    flexWrap: "wrap",
  },
  title: {
    margin: 0,
  },
  newButton: {
    textDecoration: "none",
    border: "none",
    background: "#2563eb",
    color: "#fff",
    borderRadius: "6px",
    padding: "8px 12px",
  },
  error: {
    color: "#b91c1c",
    background: "#fee2e2",
    border: "1px solid #fecaca",
    borderRadius: "6px",
    padding: "8px",
  },
  emptyState: {
    border: "1px dashed #d1d5db",
    borderRadius: "8px",
    padding: "18px",
    color: "#4b5563",
    marginTop: "12px",
  },
  grid: {
    marginTop: "14px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "12px",
  },
};
