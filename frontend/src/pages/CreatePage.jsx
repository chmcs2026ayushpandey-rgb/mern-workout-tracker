import { useState } from "react";
import { useNavigate } from "react-router-dom";

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

// Replace with real auth userId when you add authentication
const TEMP_USER_ID = "user_001";

export default function CreatePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    type: "",
    duration: "",
    distance: "",
    calories: "",
    date: new Date().toISOString().split("T")[0],
    notes: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

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
        userId: TEMP_USER_ID,
        type: form.type,
        duration: Number(form.duration),
        date: new Date(form.date).toISOString(),
        ...(form.distance && { distance: Number(form.distance) }),
        ...(form.calories && { calories: Number(form.calories) }),
        ...(form.notes.trim() && { notes: form.notes.trim() }),
      };

      const res = await fetch(`${import.meta.env.VITE_API_URL}/workouts`,  {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => navigate("/"), 1200);
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
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #0a0a14 0%, #0f0c1e 60%, #0a0a14 100%)",
      fontFamily: "'Syne', sans-serif",
      color: "#fff",
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "center",
      padding: "3rem 1.5rem",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Space+Mono:wght@400;700&display=swap');
        * { box-sizing: border-box; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @keyframes successPop { 0% { transform:scale(0.8); opacity:0; } 60% { transform:scale(1.1); } 100% { transform:scale(1); opacity:1; } }
        input:focus, textarea:focus { outline: none; }
        input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.2); }
        textarea { resize: vertical; min-height: 80px; }
        .field-input {
          width: 100%; background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px; padding: 12px 16px;
          color: #fff; font-size: 0.95rem;
          font-family: 'Syne', sans-serif; font-weight: 600;
          transition: all 0.2s;
        }
        .field-input:focus {
          border-color: var(--accent);
          background: rgba(255,255,255,0.07);
          box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 15%, transparent);
        }
        .field-input.error { border-color: #ef4444 !important; }
        input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0.6); cursor: pointer; }
      `}</style>

      <div style={{ width: "100%", maxWidth: "560px", animation: "fadeUp 0.5s ease both", "--accent": accentColor }}>

        <button onClick={() => navigate("/")} style={{
          background: "transparent", border: "none", color: "rgba(255,255,255,0.4)",
          cursor: "pointer", display: "flex", alignItems: "center", gap: "6px",
          fontSize: "0.85rem", fontWeight: 600, fontFamily: "'Syne', sans-serif",
          marginBottom: "1.75rem", padding: 0, letterSpacing: "0.03em",
        }}>
          ← Back to Dashboard
        </button>

        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{
            fontSize: "2.2rem", fontWeight: 800, letterSpacing: "-0.04em",
            background: `linear-gradient(135deg, #fff 40%, ${accentColor})`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            transition: "background 0.4s",
          }}>Log New Workout</h1>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.9rem", marginTop: "6px" }}>
            Record your activity, duration & stats.
          </p>
        </div>

        <div style={{
          background: "linear-gradient(145deg, #13131f, #1a1a2e)",
          border: `1px solid ${accentColor}22`,
          borderRadius: "20px", padding: "2rem",
          boxShadow: `0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px ${accentColor}11`,
          transition: "border-color 0.4s",
        }}>

          {success ? (
            <div style={{ textAlign: "center", padding: "2rem", animation: "successPop 0.5s ease both" }}>
              <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>✅</div>
              <p style={{ color: "#10b981", fontWeight: 700, fontSize: "1.1rem" }}>Workout logged!</p>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.85rem", marginTop: "6px" }}>Redirecting…</p>
            </div>
          ) : (
            <>
              {errors.server && (
                <div style={{
                  background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
                  borderRadius: "10px", padding: "12px 16px", color: "#ef4444",
                  fontSize: "0.85rem", marginBottom: "1.25rem", wordBreak: "break-word",
                }}>⚠️ {errors.server}</div>
              )}

              {/* Workout Type Picker */}
              <Field label="Workout Type" error={errors.type}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "4px" }}>
                  {workoutTypes.map((t) => (
                    <button key={t} type="button"
                      onClick={() => { setForm({ ...form, type: t }); if (errors.type) setErrors({ ...errors, type: null }); }}
                      style={{
                        background: form.type === t ? `${typeColors[t]}22` : "rgba(255,255,255,0.04)",
                        border: `1px solid ${form.type === t ? typeColors[t] : "rgba(255,255,255,0.08)"}`,
                        color: form.type === t ? typeColors[t] : "rgba(255,255,255,0.5)",
                        borderRadius: "8px", padding: "7px 13px",
                        fontSize: "0.8rem", fontWeight: 700,
                        fontFamily: "'Syne', sans-serif", cursor: "pointer",
                        transition: "all 0.2s", letterSpacing: "0.03em",
                        boxShadow: form.type === t ? `0 4px 12px ${typeColors[t]}33` : "none",
                      }}>
                      {typeIcons[t]} {t}
                    </button>
                  ))}
                </div>
                {errors.type && <p style={{ color: "#ef4444", fontSize: "0.75rem", marginTop: "6px" }}>⚠ {errors.type}</p>}
              </Field>

              {/* Duration + Date */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <Field label="⏱ Duration (mins)" error={errors.duration}>
                  <input className={`field-input${errors.duration ? " error" : ""}`}
                    name="duration" value={form.duration} onChange={handleChange}
                    placeholder="e.g. 45" type="number" min="1"
                    style={{ "--accent": accentColor }} />
                </Field>
                <Field label="📅 Date" error={errors.date}>
                  <input className={`field-input${errors.date ? " error" : ""}`}
                    name="date" value={form.date} onChange={handleChange}
                    type="date" style={{ "--accent": accentColor }} />
                </Field>
              </div>

              {/* Distance + Calories */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <Field label="📍 Distance (km)" error={errors.distance}>
                  <input className={`field-input${errors.distance ? " error" : ""}`}
                    name="distance" value={form.distance} onChange={handleChange}
                    placeholder="e.g. 5.2" type="number" min="0" step="0.1"
                    style={{ "--accent": accentColor }} />
                </Field>
                <Field label="🔥 Calories" error={errors.calories}>
                  <input className={`field-input${errors.calories ? " error" : ""}`}
                    name="calories" value={form.calories} onChange={handleChange}
                    placeholder="e.g. 320" type="number" min="0"
                    style={{ "--accent": accentColor }} />
                </Field>
              </div>

              {/* Notes */}
              <Field label="📝 Notes (optional)">
                <textarea className="field-input"
                  name="notes" value={form.notes} onChange={handleChange}
                  placeholder="How did it feel? Any PRs?"
                  style={{ "--accent": accentColor }} />
              </Field>

              <button onClick={handleSubmit} disabled={loading} style={{
                width: "100%", marginTop: "0.5rem",
                background: loading ? "rgba(249,115,22,0.4)" : `linear-gradient(135deg, ${accentColor}, #ef4444)`,
                border: "none", borderRadius: "12px",
                color: "#fff", fontWeight: 800, fontSize: "1rem",
                fontFamily: "'Syne', sans-serif", letterSpacing: "0.04em",
                padding: "14px", cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.3s",
                boxShadow: loading ? "none" : `0 8px 24px ${accentColor}44`,
              }}>
                {loading ? "Logging…" : "Log Workout →"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <div style={{ marginBottom: "1.25rem" }}>
      <label style={{
        display: "block", color: "rgba(255,255,255,0.55)",
        fontSize: "0.75rem", fontWeight: 700,
        letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "8px",
      }}>{label}</label>
      {children}
      {error && typeof error === "string" && (
        <p style={{ color: "#ef4444", fontSize: "0.75rem", marginTop: "5px" }}>⚠ {error}</p>
      )}
    </div>
  );
}
