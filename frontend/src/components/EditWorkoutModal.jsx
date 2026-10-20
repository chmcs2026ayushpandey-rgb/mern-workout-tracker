import { useState } from "react";
import api from "../lib/axios";
import { useToast } from "../context/ToastContext";
import { WORKOUT_TYPES, TYPE_COLORS, fieldStyle, getErrorMessage } from "../lib/utils";
import ExerciseEditor, { exercisesFromWorkout, exercisesToPayload } from "./ExerciseEditor";

export default function EditWorkoutModal({ workout, onClose, onSave }) {
  const toast = useToast();
  const [form, setForm] = useState({
    type: workout.type,
    duration: String(workout.duration ?? ""),
    distance: workout.distance != null ? String(workout.distance) : "",
    calories: workout.calories != null ? String(workout.calories) : "",
    date: new Date(workout.date).toISOString().split("T")[0],
    notes: workout.notes || "",
  });
  const [exercises, setExercises] = useState(() => exercisesFromWorkout(workout));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!form.type || !form.duration || Number(form.duration) <= 0) {
      setError("Choose a type and enter a positive duration");
      return;
    }

    setSaving(true);
    setError("");
    try {
      const payload = {
        type: form.type,
        duration: Number(form.duration),
        date: new Date(form.date).toISOString(),
        distance: form.distance ? Number(form.distance) : null,
        calories: form.calories ? Number(form.calories) : null,
        notes: form.notes.trim(),
        exercises: exercisesToPayload(exercises),
      };
      const res = await api.put(`/workouts/${workout._id}`, payload);
      toast.success("Workout updated");
      onSave(res.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const accent = TYPE_COLORS[form.type] || "#f97316";

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
        zIndex: 50,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "560px",
          maxHeight: "90vh",
          overflowY: "auto",
          background: "linear-gradient(145deg, #13131f, #1a1a2e)",
          border: `1px solid ${accent}33`,
          borderRadius: "18px",
          padding: "1.75rem",
          fontFamily: "'Syne', sans-serif",
        }}
      >
        <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "1.25rem" }}>Edit Workout</h2>

        {error && (
          <div
            style={{
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: "10px",
              padding: "10px 14px",
              color: "#ef4444",
              fontSize: "0.85rem",
              marginBottom: "1rem",
            }}
          >
            ⚠️ {error}
          </div>
        )}

        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "1rem" }}>
          {WORKOUT_TYPES.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setForm({ ...form, type: t })}
              style={{
                background: form.type === t ? `${TYPE_COLORS[t]}22` : "rgba(255,255,255,0.04)",
                border: `1px solid ${form.type === t ? TYPE_COLORS[t] : "rgba(255,255,255,0.08)"}`,
                color: form.type === t ? TYPE_COLORS[t] : "rgba(255,255,255,0.5)",
                borderRadius: "8px",
                padding: "6px 12px",
                fontSize: "0.8rem",
                fontWeight: 700,
                fontFamily: "inherit",
                cursor: "pointer",
              }}
            >
              {t}
            </button>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <Field label="Duration (mins)">
            <input type="number" min="1" style={fieldStyle} value={form.duration}
              onChange={(e) => setForm({ ...form, duration: e.target.value })} />
          </Field>
          <Field label="Date">
            <input type="date" style={fieldStyle} value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })} />
          </Field>
          <Field label="Distance (km)">
            <input type="number" min="0" step="0.1" style={fieldStyle} value={form.distance}
              onChange={(e) => setForm({ ...form, distance: e.target.value })} />
          </Field>
          <Field label="Calories">
            <input type="number" min="0" style={fieldStyle} value={form.calories}
              onChange={(e) => setForm({ ...form, calories: e.target.value })} />
          </Field>
        </div>

        <Field label="Exercises & Sets">
          <ExerciseEditor exercises={exercises} onChange={setExercises} />
        </Field>

        <Field label="Notes">
          <textarea rows={3} style={{ ...fieldStyle, resize: "vertical" }} value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })} />
        </Field>

        <div style={{ display: "flex", gap: "10px", marginTop: "1rem" }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: "10px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#fff",
              fontWeight: 700,
              fontFamily: "inherit",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: "10px",
              background: `linear-gradient(135deg, ${accent}, #ef4444)`,
              border: "none",
              color: "#fff",
              fontWeight: 800,
              fontFamily: "inherit",
              cursor: saving ? "not-allowed" : "pointer",
              opacity: saving ? 0.6 : 1,
            }}
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: "12px" }}>
      <label
        style={{
          display: "block",
          color: "rgba(255,255,255,0.55)",
          fontSize: "0.7rem",
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          marginBottom: "6px",
        }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}