import { useState, useEffect } from "react";

const workoutTypes = ["Running", "Cycling", "Swimming", "Weightlifting", "Yoga", "HIIT", "Walking", "Other"];

const typeColors = {
  Running: "#f97316", Cycling: "#3b82f6", Swimming: "#06b6d4",
  Weightlifting: "#ef4444", Yoga: "#8b5cf6", HIIT: "#f59e0b",
  Walking: "#10b981", Other: "#6b7280"
};

const typeIcons = {
  Running: "🏃", Cycling: "🚴", Swimming: "🏊", Weightlifting: "🏋️",
  Yoga: "🧘", HIIT: "⚡", Walking: "🚶", Other: "💪"
};

export default function EditWorkoutModal({ workout, onClose, onSave }) {
  const [form, setForm] = useState({
    type: "",
    duration: "",
    distance: "",
    calories: "",
    date: "",
    notes: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Populate form with existing workout data
  useEffect(() => {
    if (workout) {
      setForm({
        type: workout.type || "",
        duration: workout.duration?.toString() || "",
        distance: workout.distance?.toString() || "",
        calories: workout.calories?.toString() || "",
        date: workout.date
          ? new Date(workout.date).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        notes: workout.notes || "",
      });
    }
  }, [workout]);

  const validate = () => {
    const e = {};
    if (!form.type) e.type = "Select a workout type";
    if (!form.duration) e.duration = "Duration is required";
    else if (isNaN(Number(form.duration)) || Number(form.duration) <= 0) e.duration = "Must be a positive number";
    if (!form.date) e.date = "Date is required";
    if (form.distance && isNaN(Number(form.distance))) e.distance = "Must be a number";
    if (form.calories && isNaN(Number(form.calories))) e.calories = "Must be a number";
    return e;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: null });
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }

    setLoading(true);
    try {
      const payload = {
        userId: workout.userId,
        type: form.type,
        duration: Number(form.duration),
        date: new Date(form.date).toISOString(),
        distance: form.distance ? Number(form.distance) : undefined,
        calories: form.calories ? Number(form.calories) : undefined,
        notes: form.notes.trim() || undefined,
      };

      const res = await fetch(`/api/workouts/${workout._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const updated = await res.json();
        setSuccess(true);
        setTimeout(() => {
          onSave(updated);
          onClose();
        }, 900);
      } else {
        let msg = "Something went wrong";
        try { const d = await res.json(); msg = d.message || d.error || JSON.stringify(d); } catch (_) {}
        setErrors({ server: `(${res.status}) ${msg}` });
      }
    } catch (err) {
      setErrors({ server: `Network error: ${err.message}` });
    } finally {
      setLoading(false);
    }
  };

  const accentColor = form.type ? typeColors[form.type] : "#f97316";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&display=swap');
        @keyframes backdropIn { from { opacity:0; } to { opacity:1; } }
        @keyframes modalIn { from { opacity:0; transform:translateY(30px) scale(0.97); } to { opacity:1; transform:translateY(0) scale(1); } }
        @keyframes successPop { 0% { transform:scale(0.8); opacity:0; } 60% { transform:scale(1.1); } 100% { transform:scale(1); opacity:1; } }
        .edit-input {
          width: 100%; background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px; padding: 11px 14px;
          color: #fff; font-size: 0.9rem;
          font-family: 'Syne', sans-serif; font-weight: 600;
          transition: all 0.2s; box-sizing: border-box;
        }
        .edit-input:focus { outline: none; border-color: var(--accent); background: rgba(255,255,255,0.08); box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 15%, transparent); }
        .edit-input.error { border-color: #ef4444 !important; }
        .edit-input::placeholder { color: rgba(255,255,255,0.2); }
        input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0.5); cursor: pointer; }
        textarea.edit-input { resize: vertical; min-height: 75px; }
      `}</style>

      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0,
          background: "rgba(0,0,0,0.75)",
          backdropFilter: "blur(6px)",
          zIndex: 200,
          animation: "backdropIn 0.2s ease both",
        }}
      />

      {/* Modal */}
      <div style={{
        position: "fixed",
        top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 201,
        width: "min(95vw, 540px)",
        maxHeight: "90vh",
        overflowY: "auto",
        background: "linear-gradient(145deg, #13131f, #1a1a2e)",
        border: `1px solid ${accentColor}33`,
        borderRadius: "20px",
        padding: "2rem",
        boxShadow: `0 30px 80px rgba(0,0,0,0.6), 0 0 0 1px ${accentColor}11`,
        animation: "modalIn 0.3s cubic-bezier(0.34,1.56,0.64,1) both",
        fontFamily: "'Syne', sans-serif",
        "--accent": accentColor,
      }}>

        {success ? (
          <div style={{ textAlign: "center", padding: "2.5rem 1rem", animation: "successPop 0.5s ease both" }}>
            <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>✅</div>
            <p style={{ color: "#10b981", fontWeight: 700, fontSize: "1.1rem" }}>Workout updated!</p>
          </div>
        ) : (
          <>
            {/* Modal Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <div>
                <h2 style={{
                  fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.03em",
                  background: `linear-gradient(135deg, #fff, ${accentColor})`,
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                  transition: "background 0.3s",
                }}>Edit Workout</h2>
                <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.8rem", marginTop: "3px" }}>
                  Update your workout details below
                </p>
              </div>
              <button onClick={onClose} style={{
                background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.6)", borderRadius: "8px",
                width: "34px", height: "34px", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1.1rem", transition: "all 0.2s",
              }}>✕</button>
            </div>

            {/* Server error */}
            {errors.server && (
              <div style={{
                background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
                borderRadius: "10px", padding: "12px 14px", color: "#ef4444",
                fontSize: "0.82rem", marginBottom: "1.25rem", wordBreak: "break-word",
              }}>⚠️ {errors.server}</div>
            )}

            {/* Type Picker */}
            <Field label="Workout Type" error={errors.type}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "7px", marginTop: "4px" }}>
                {workoutTypes.map((t) => (
                  <button key={t} type="button"
                    onClick={() => { setForm({ ...form, type: t }); if (errors.type) setErrors({ ...errors, type: null }); }}
                    style={{
                      background: form.type === t ? `${typeColors[t]}22` : "rgba(255,255,255,0.04)",
                      border: `1px solid ${form.type === t ? typeColors[t] : "rgba(255,255,255,0.08)"}`,
                      color: form.type === t ? typeColors[t] : "rgba(255,255,255,0.5)",
                      borderRadius: "8px", padding: "6px 12px",
                      fontSize: "0.78rem", fontWeight: 700,
                      fontFamily: "'Syne', sans-serif", cursor: "pointer",
                      transition: "all 0.2s", letterSpacing: "0.03em",
                      boxShadow: form.type === t ? `0 4px 12px ${typeColors[t]}33` : "none",
                    }}>
                    {typeIcons[t]} {t}
                  </button>
                ))}
              </div>
              {errors.type && <p style={{ color: "#ef4444", fontSize: "0.75rem", marginTop: "5px" }}>⚠ {errors.type}</p>}
            </Field>

            {/* Duration + Date */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <Field label="⏱ Duration (mins)" error={errors.duration}>
                <input className={`edit-input${errors.duration ? " error" : ""}`}
                  name="duration" value={form.duration} onChange={handleChange}
                  placeholder="e.g. 45" type="number" min="1"
                  style={{ "--accent": accentColor }} />
              </Field>
              <Field label="📅 Date" error={errors.date}>
                <input className={`edit-input${errors.date ? " error" : ""}`}
                  name="date" value={form.date} onChange={handleChange}
                  type="date" style={{ "--accent": accentColor }} />
              </Field>
            </div>

            {/* Distance + Calories */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <Field label="📍 Distance (km)" error={errors.distance}>
                <input className={`edit-input${errors.distance ? " error" : ""}`}
                  name="distance" value={form.distance} onChange={handleChange}
                  placeholder="e.g. 5.2" type="number" min="0" step="0.1"
                  style={{ "--accent": accentColor }} />
              </Field>
              <Field label="🔥 Calories" error={errors.calories}>
                <input className={`edit-input${errors.calories ? " error" : ""}`}
                  name="calories" value={form.calories} onChange={handleChange}
                  placeholder="e.g. 320" type="number" min="0"
                  style={{ "--accent": accentColor }} />
              </Field>
            </div>

            {/* Notes */}
            <Field label="📝 Notes (optional)">
              <textarea className="edit-input"
                name="notes" value={form.notes} onChange={handleChange}
                placeholder="How did it feel? Any PRs?"
                style={{ "--accent": accentColor }} />
            </Field>

            {/* Actions */}
            <div style={{ display: "flex", gap: "10px", marginTop: "0.5rem" }}>
              <button onClick={onClose} style={{
                flex: 1, background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.6)", borderRadius: "12px",
                padding: "13px", fontWeight: 700, fontSize: "0.9rem",
                fontFamily: "'Syne', sans-serif", cursor: "pointer", transition: "all 0.2s",
              }}>Cancel</button>
              <button onClick={handleSubmit} disabled={loading} style={{
                flex: 2,
                background: loading ? "rgba(249,115,22,0.4)" : `linear-gradient(135deg, ${accentColor}, #ef4444)`,
                border: "none", borderRadius: "12px",
                color: "#fff", fontWeight: 800, fontSize: "0.95rem",
                fontFamily: "'Syne', sans-serif", letterSpacing: "0.04em",
                padding: "13px", cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.3s",
                boxShadow: loading ? "none" : `0 8px 20px ${accentColor}44`,
              }}>
                {loading ? "Saving…" : "Save Changes →"}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

function Field({ label, error, children }) {
  return (
    <div style={{ marginBottom: "1.1rem" }}>
      <label style={{
        display: "block", color: "rgba(255,255,255,0.5)",
        fontSize: "0.72rem", fontWeight: 700,
        letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "7px",
      }}>{label}</label>
      {children}
      {error && typeof error === "string" && (
        <p style={{ color: "#ef4444", fontSize: "0.73rem", marginTop: "5px" }}>⚠ {error}</p>
      )}
    </div>
  );
}
