import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/axios";
import { useToast } from "../context/ToastContext";
import { WORKOUT_TYPES, TYPE_COLORS, TYPE_ICONS, fieldStyle, getErrorMessage } from "../lib/utils";
import ExerciseEditor, { exercisesToPayload } from "../components/ExerciseEditor";

export default function CreatePage() {
  const navigate = useNavigate();
  const toast = useToast();
  const [form, setForm] = useState({
    type: "",
    duration: "",
    distance: "",
    calories: "",
    date: new Date().toISOString().split("T")[0],
    notes: "",
  });
  const [exercises, setExercises] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const accent = form.type ? TYPE_COLORS[form.type] : "#f97316";

  const validate = () => {
    const e = {};
    if (!form.type) e.type = "Select a workout type";
    if (!form.duration) e.duration = "Duration is required";
    else if (Number(form.duration) <= 0) e.duration = "Must be a positive number";
    if (!form.date) e.date = "Date is required";
    return e;
  };

  const handleSubmit = async () => {
    const validation = validate();
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }

    setLoading(true);
    try {
      await api.post("/workouts", {
        type: form.type,
        duration: Number(form.duration),
        date: new Date(form.date).toISOString(),
        ...(form.distance && { distance: Number(form.distance) }),
        ...(form.calories && { calories: Number(form.calories) }),
        ...(form.notes.trim() && { notes: form.notes.trim() }),
        exercises: exercisesToPayload(exercises),
      });
      toast.success("Workout logged");
      navigate("/");
    } catch (err) {
      setErrors({ server: getErrorMessage(err) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "3rem 1.5rem", fontFamily: "'Syne', sans-serif" }}>
      <div style={{ width: "100%", maxWidth: "560px" }}>
        <button
          onClick={() => navigate("/")}
          style={{
            background: "transparent",
            border: "none",
            color: "rgba(255,255,255,0.4)",
            cursor: "pointer",
            fontFamily: "inherit",
            fontWeight: 600,
            marginBottom: "1.75rem",
            padding: 0,
          }}
        >
          ← Back to Dashboard
        </button>

        <h1
          style={{
            fontSize: "2.2rem",
            fontWeight: 800,
            letterSpacing: "-0.04em",
            background: `linear-gradient(135deg, #fff 40%, ${accent})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Log New Workout
        </h1>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.9rem", margin: "6px 0 2rem" }}>
          Record your activity, duration & stats.
        </p>

        <div
          style={{
            background: "linear-gradient(145deg, #13131f, #1a1a2e)",
            border: `1px solid ${accent}22`,
            borderRadius: "20px",
            padding: "2rem",
          }}
        >
          {errors.server && (
            <div
              style={{
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.3)",
                borderRadius: "10px",
                padding: "12px 16px",
                color: "#ef4444",
                fontSize: "0.85rem",
                marginBottom: "1.25rem",
              }}
            >
              ⚠️ {errors.server}
            </div>
          )}

          <Field label="Workout Type" error={errors.type}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "4px" }}>
              {WORKOUT_TYPES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    setForm({ ...form, type: t });
                    setErrors({ ...errors, type: null });
                  }}
                  style={{
                    background: form.type === t ? `${TYPE_COLORS[t]}22` : "rgba(255,255,255,0.04)",
                    border: `1px solid ${form.type === t ? TYPE_COLORS[t] : "rgba(255,255,255,0.08)"}`,
                    color: form.type === t ? TYPE_COLORS[t] : "rgba(255,255,255,0.5)",
                    borderRadius: "8px",
                    padding: "7px 13px",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    fontFamily: "inherit",
                    cursor: "pointer",
                  }}
                >
                  {TYPE_ICONS[t]} {t}
                </button>
              ))}
            </div>
          </Field>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <Field label="⏱ Duration (mins)" error={errors.duration}>
              <input type="number" min="1" placeholder="e.g. 45" style={fieldStyle}
                value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
            </Field>
            <Field label="📅 Date" error={errors.date}>
              <input type="date" style={fieldStyle}
                value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </Field>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <Field label="📍 Distance (km)">
              <input type="number" min="0" step="0.1" placeholder="e.g. 5.2" style={fieldStyle}
                value={form.distance} onChange={(e) => setForm({ ...form, distance: e.target.value })} />
            </Field>
            <Field label="🔥 Calories">
              <input type="number" min="0" placeholder="e.g. 320" style={fieldStyle}
                value={form.calories} onChange={(e) => setForm({ ...form, calories: e.target.value })} />
            </Field>
          </div>

          <Field label="🏋️ Exercises & Sets (optional)">
            <ExerciseEditor exercises={exercises} onChange={setExercises} />
          </Field>

          <Field label="📝 Notes (optional)">
            <textarea rows={3} placeholder="How did it feel? Any PRs?"
              style={{ ...fieldStyle, resize: "vertical" }}
              value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </Field>

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: "100%",
              marginTop: "0.5rem",
              padding: "14px",
              borderRadius: "12px",
              border: "none",
              background: `linear-gradient(135deg, ${accent}, #ef4444)`,
              color: "#fff",
              fontWeight: 800,
              fontSize: "1rem",
              fontFamily: "inherit",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? "Logging…" : "Log Workout →"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <div style={{ marginBottom: "1.25rem" }}>
      <label
        style={{
          display: "block",
          color: "rgba(255,255,255,0.55)",
          fontSize: "0.75rem",
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          marginBottom: "8px",
        }}
      >
        {label}
      </label>
      {children}
      {error && <p style={{ color: "#ef4444", fontSize: "0.75rem", marginTop: "5px" }}>⚠ {error}</p>}
    </div>
  );
}