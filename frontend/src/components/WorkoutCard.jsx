import { useState } from "react";
import EditWorkoutModal from "./EditWorkoutModal";

const typeColors = {
  Running: "#f97316", Cycling: "#3b82f6", Swimming: "#06b6d4",
  Weightlifting: "#ef4444", Yoga: "#8b5cf6", HIIT: "#f59e0b",
  Walking: "#10b981", Other: "#6b7280"
};

const typeIcons = {
  Running: "🏃", Cycling: "🚴", Swimming: "🏊", Weightlifting: "🏋️",
  Yoga: "🧘", HIIT: "⚡", Walking: "🚶", Other: "💪"
};

export default function WorkoutCard({ workout, onDelete, onUpdate }) {
  const [hovered, setHovered] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editing, setEditing] = useState(false);
  const [currentWorkout, setCurrentWorkout] = useState(workout);

  const accentColor = typeColors[currentWorkout.type] || "#6b7280";
  const icon = typeIcons[currentWorkout.type] || "💪";

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/workouts/${currentWorkout._id}`, { method: "DELETE" });
      if (res.ok) onDelete(currentWorkout._id);
      else setDeleting(false);
    } catch {
      setDeleting(false);
    }
  };

  const handleSave = (updated) => {
    setCurrentWorkout(updated);
    if (onUpdate) onUpdate(updated);
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  return (
    <>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          fontFamily: "'Syne', sans-serif",
          background: hovered ? "linear-gradient(145deg, #1a1a2e, #16213e)" : "linear-gradient(145deg, #13131f, #1a1a2e)",
          border: `1px solid ${hovered ? accentColor + "55" : "rgba(255,255,255,0.06)"}`,
          borderRadius: "16px", padding: "1.5rem",
          position: "relative", overflow: "hidden",
          transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
          transform: hovered ? "translateY(-4px)" : "translateY(0)",
          boxShadow: hovered
            ? `0 20px 40px rgba(0,0,0,0.4), 0 0 0 1px ${accentColor}33`
            : "0 4px 20px rgba(0,0,0,0.2)",
        }}>

        {/* Top accent line */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: "3px",
          background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
          opacity: hovered ? 1 : 0.4, transition: "opacity 0.3s",
        }} />

        {/* Header row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "40px", height: "40px", borderRadius: "10px",
              background: `${accentColor}22`, border: `1px solid ${accentColor}44`,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem",
            }}>{icon}</div>
            <span style={{
              background: `${accentColor}22`, color: accentColor,
              border: `1px solid ${accentColor}44`,
              padding: "4px 12px", borderRadius: "20px",
              fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
            }}>{currentWorkout.type}</span>
          </div>

          {/* Edit + Delete buttons */}
          <div style={{ display: "flex", gap: "6px" }}>
            <button
              onClick={() => setEditing(true)}
              title="Edit workout"
              style={{
                background: `${accentColor}18`,
                border: `1px solid ${accentColor}33`,
                color: accentColor,
                borderRadius: "8px", width: "32px", height: "32px",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", transition: "all 0.2s",
              }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              title="Delete workout"
              style={{
                background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)",
                color: "#ef4444", borderRadius: "8px", width: "32px", height: "32px",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", transition: "all 0.2s", opacity: deleting ? 0.5 : 1,
              }}>
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 13 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "1rem" }}>
          <Stat label="Duration" value={`${currentWorkout.duration} min`} color={accentColor} />
          {currentWorkout.distance != null && <Stat label="Distance" value={`${currentWorkout.distance} km`} color={accentColor} />}
          {currentWorkout.calories != null && <Stat label="Calories" value={`${currentWorkout.calories} kcal`} color={accentColor} />}
        </div>

        {/* Notes */}
        {currentWorkout.notes && (
          <p style={{
            color: "rgba(255,255,255,0.45)", fontSize: "0.82rem",
            fontStyle: "italic", marginBottom: "0.75rem",
            borderLeft: `2px solid ${accentColor}44`, paddingLeft: "10px",
            lineHeight: 1.5,
          }}>
            "{currentWorkout.notes}"
          </p>
        )}

        {/* Date */}
        <div style={{
          color: "rgba(255,255,255,0.3)", fontSize: "0.75rem",
          fontFamily: "'Space Mono', monospace", letterSpacing: "0.05em",
          borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "0.75rem",
        }}>
          {currentWorkout.date ? formatDate(currentWorkout.date) : formatDate(currentWorkout.createdAt)}
        </div>
      </div>

      {/* Edit Modal */}
      {editing && (
        <EditWorkoutModal
          workout={currentWorkout}
          onClose={() => setEditing(false)}
          onSave={handleSave}
        />
      )}
    </>
  );
}

function Stat({ label, value, color }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: "10px", padding: "8px 12px", textAlign: "center", flex: "1 1 80px",
    }}>
      <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.65rem", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "3px" }}>{label}</div>
      <div style={{ color: "#fff", fontWeight: 700, fontSize: "0.95rem" }}>{value}</div>
    </div>
  );
}
