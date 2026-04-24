export default function FilterBar({
  statusFilter,
  priorityFilter,
  onStatusChange,
  onPriorityChange,
}) {
  return (
    <div style={styles.wrapper}>
      <div style={styles.field}>
        <label style={styles.label}>Status</label>
        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          style={styles.select}
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>

      <div style={styles.field}>
        <label style={styles.label}>Priority</label>
        <select
          value={priorityFilter}
          onChange={(e) => onPriorityChange(e.target.value)}
          style={styles.select}
        >
          <option value="all">All</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    gap: "12px",
    marginBottom: "16px",
    flexWrap: "wrap",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "13px",
    color: "#374151",
  },
  select: {
    minWidth: "150px",
    padding: "8px 10px",
    borderRadius: "6px",
    border: "1px solid #d1d5db",
    background: "#fff",
  },
};
