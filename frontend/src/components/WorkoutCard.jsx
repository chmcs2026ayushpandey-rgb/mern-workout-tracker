import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../lib/axios";
import { useToast } from "../context/ToastContext";
import { TYPE_COLORS, TYPE_ICONS, formatDate, getErrorMessage } from "../lib/utils";
import EditWorkoutModal from "./EditWorkoutModal";

export default function WorkoutCard({ workout, onDelete, onUpdate }) {
  const toast = useToast();
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const color = TYPE_COLORS[workout.type] || TYPE_COLORS.Other;

  const handleDelete = async () => {
    if (!window.confirm("Delete this workout?")) return;

    setDeleting(true);
    try {
      await api.delete(`/workouts/${workout._id}`);
      toast.success("Workout deleted");
      onDelete?.(workout._id);
    } catch (err) {
      toast.error(getErrorMessage(err));
      setDeleting(false);
    }
  };

  return (
    <div
      style={{
        background: "linear-gradient(145deg, #13131f, #1a1a2e)",
        border: `1px solid ${color}33`,
        borderRadius: "16px",
        padding: "1.25rem",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        fontFamily: "'Syne', sans-serif",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ color, fontWeight: 700, fontSize: "0.9rem" }}>
          {TYPE_ICONS[workout.type]} {workout.type}
        </span>
        <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.75rem" }}>
          {formatDate(workout.date)}
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px" }}>
        <Stat label="Duration" value={`${workout.duration} min`} />
        {workout.distance != null && <Stat label="Distance" value={`${workout.distance} km`} />}
        {workout.calories != null && <Stat label="Calories" value={`${workout.calories} kcal`} />}
      </div>

      {workout.notes && (
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.85rem", lineHeight: 1.5 }}>
          {workout.notes}
        </p>
      )}

      <div style={{ display: "flex", gap: "8px", marginTop: "auto" }}>
        <Link to={`/workout/${workout._id}`} style={buttonStyle("#fff")}>View</Link>
        <button onClick={() => setEditing(true)} style={buttonStyle("#fff")}>Edit</button>
        <button onClick={handleDelete} disabled={deleting} style={buttonStyle("#ef4444")}>
          {deleting ? "…" : "Delete"}
        </button>
      </div>

      {editing && (
        <EditWorkoutModal
          workout={workout}
          onClose={() => setEditing(false)}
          onSave={(updated) => {
            setEditing(false);
            onUpdate?.(updated);
          }}
        />
      )}
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div>
      <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>
        {label}
      </div>
      <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>{value}</div>
    </div>
  );
}

const buttonStyle = (color) => ({
  flex: 1,
  textAlign: "center",
  padding: "8px",
  borderRadius: "8px",
  fontSize: "0.8rem",
  fontWeight: 700,
  fontFamily: "'Syne', sans-serif",
  cursor: "pointer",
  textDecoration: "none",
  color,
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.1)",
});
 