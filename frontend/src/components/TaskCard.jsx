import { Link } from "react-router-dom";

export default function TaskCard({ task, onDelete }) {
  const dueDateText = task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No due date";

  return (
    <div style={styles.card}>
      <div style={styles.headerRow}>
        <h3 style={styles.title}>{task.title}</h3>
        <div style={styles.badges}>
          <span style={{ ...styles.badge, ...statusStyle(task.status) }}>{task.status}</span>
          <span style={{ ...styles.badge, ...priorityStyle(task.priority) }}>{task.priority}</span>
        </div>
      </div>

      {task.description ? <p style={styles.description}>{task.description}</p> : null}

      <p style={styles.meta}>
        <strong>Due:</strong> {dueDateText}
      </p>

      <div style={styles.actions}>
        <Link to={`/tasks/${task._id}/edit`} style={styles.editBtn}>
          Edit
        </Link>
        <button onClick={() => onDelete(task._id)} style={styles.deleteBtn}>
          Delete
        </button>
      </div>
    </div>
  );
}

function statusStyle(status) {
  if (status === "done") return { background: "#dcfce7", color: "#166534" };
  if (status === "in-progress") return { background: "#fef3c7", color: "#92400e" };
  return { background: "#e0e7ff", color: "#3730a3" };
}

function priorityStyle(priority) {
  if (priority === "high") return { background: "#fee2e2", color: "#b91c1c" };
  if (priority === "medium") return { background: "#e0f2fe", color: "#075985" };
  return { background: "#f3f4f6", color: "#374151" };
}

const styles = {
  card: {
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    padding: "14px",
    background: "#fff",
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "10px",
    alignItems: "center",
    marginBottom: "10px",
    flexWrap: "wrap",
  },
  title: {
    margin: 0,
    fontSize: "18px",
    color: "#111827",
  },
  badges: {
    display: "flex",
    gap: "8px",
  },
  badge: {
    fontSize: "12px",
    padding: "4px 8px",
    borderRadius: "999px",
    textTransform: "capitalize",
    fontWeight: 600,
  },
  description: {
    marginTop: 0,
    color: "#374151",
  },
  meta: {
    marginBottom: "12px",
    color: "#4b5563",
    fontSize: "14px",
  },
  actions: {
    display: "flex",
    gap: "10px",
  },
  editBtn: {
    textDecoration: "none",
    border: "1px solid #d1d5db",
    color: "#111827",
    borderRadius: "6px",
    padding: "7px 12px",
    fontSize: "14px",
  },
  deleteBtn: {
    border: "1px solid #fecaca",
    background: "#fee2e2",
    color: "#991b1b",
    borderRadius: "6px",
    padding: "7px 12px",
    fontSize: "14px",
    cursor: "pointer",
  },
};
