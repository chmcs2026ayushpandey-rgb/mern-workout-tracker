import { useEffect, useState } from "react";
import WorkoutCard from "../components/WorkoutCard";

const ALL_TYPES = ["All", "Running", "Cycling", "Swimming", "Weightlifting", "Yoga", "HIIT", "Walking", "Other"];

export default function HomePage() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    fetch("/api/workouts")
      .then((r) => r.json())
      .then((data) => { setWorkouts(data); setLoading(false); })
      .catch(() => { setError("Failed to load workouts"); setLoading(false); });
  }, []);

  const handleDelete = (id) => setWorkouts((w) => w.filter((x) => x._id !== id));

  const filtered = filter === "All"
    ? workouts
    : workouts.filter((w) => w.type === filter);

  const totalMinutes = workouts.reduce((s, w) => s + (Number(w.duration) || 0), 0);
  const totalCalories = workouts.reduce((s, w) => s + (Number(w.calories) || 0), 0);
  const totalDistance = workouts.reduce((s, w) => s + (Number(w.distance) || 0), 0);

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #0a0a14 0%, #0f0c1e 50%, #0a0a14 100%)",
      fontFamily: "'Syne', sans-serif",
      color: "#fff",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Space+Mono:wght@400;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; background: #0a0a14; }
        ::-webkit-scrollbar-thumb { background: #f97316; border-radius: 3px; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
        @keyframes spin { to { transform: rotate(360deg); } }
        .workout-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.25rem; }
        @media(max-width:640px) { .workout-grid { grid-template-columns: 1fr; } }
        .stat-card { transition: transform 0.2s; }
        .stat-card:hover { transform: translateY(-3px); }
        .filter-btn:hover { opacity: 1 !important; }
      `}</style>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem 1.5rem" }}>

        {/* Hero */}
        <div style={{ marginBottom: "2.5rem", animation: "fadeUp 0.6s ease both" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
            <div style={{
              width: "8px", height: "8px", borderRadius: "50%", background: "#10b981",
              boxShadow: "0 0 12px #10b981", animation: "pulse 2s infinite",
            }} />
            <span style={{ color: "#10b981", fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" }}>
              Tracking Active
            </span>
          </div>
          <h1 style={{
            fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 800,
            letterSpacing: "-0.04em", lineHeight: 1.1,
            background: "linear-gradient(135deg, #fff 40%, rgba(255,255,255,0.4))",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            Your Workout<br />
            <span style={{
              background: "linear-gradient(135deg, #f97316, #ef4444)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>Dashboard</span>
          </h1>
        </div>

        {/* Stats */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: "1rem", marginBottom: "2rem",
          animation: "fadeUp 0.6s ease 0.1s both",
        }}>
          {[
            { label: "Total Workouts", value: workouts.length, color: "#f97316", icon: "🏋️" },
            { label: "Total Minutes", value: `${totalMinutes}`, color: "#3b82f6", icon: "⏱" },
            { label: "Calories Burned", value: totalCalories > 0 ? `${totalCalories}` : "—", color: "#ef4444", icon: "🔥" },
            { label: "km Covered", value: totalDistance > 0 ? totalDistance.toFixed(1) : "—", color: "#10b981", icon: "📍" },
          ].map((s) => (
            <div key={s.label} className="stat-card" style={{
              background: "linear-gradient(145deg, #13131f, #1a1a2e)",
              border: `1px solid ${s.color}22`, borderRadius: "14px", padding: "1.2rem",
            }}>
              <div style={{ fontSize: "1.4rem", marginBottom: "6px" }}>{s.icon}</div>
              <div style={{ color: s.color, fontWeight: 800, fontSize: "1.5rem", letterSpacing: "-0.03em" }}>{s.value}</div>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.73rem", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", marginTop: "2px" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{
          display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "1.75rem",
          animation: "fadeUp 0.6s ease 0.2s both",
        }}>
          {ALL_TYPES.map((t) => (
            <button key={t} className="filter-btn" onClick={() => setFilter(t)} style={{
              background: filter === t ? "linear-gradient(135deg,#f97316,#ef4444)" : "rgba(255,255,255,0.05)",
              border: filter === t ? "none" : "1px solid rgba(255,255,255,0.1)",
              color: filter === t ? "#fff" : "rgba(255,255,255,0.55)",
              padding: "6px 16px", borderRadius: "20px",
              fontSize: "0.8rem", fontWeight: 700, fontFamily: "'Syne', sans-serif",
              cursor: "pointer", transition: "all 0.2s", letterSpacing: "0.03em",
              boxShadow: filter === t ? "0 4px 15px rgba(249,115,22,0.3)" : "none",
              opacity: filter === t ? 1 : 0.8,
            }}>{t}</button>
          ))}
        </div>

        {/* Content */}
        {loading && (
          <div style={{ display: "flex", justifyContent: "center", padding: "4rem 0" }}>
            <div style={{
              width: "40px", height: "40px",
              border: "3px solid rgba(249,115,22,0.2)",
              borderTop: "3px solid #f97316",
              borderRadius: "50%", animation: "spin 0.8s linear infinite",
            }} />
          </div>
        )}

        {error && (
          <div style={{
            background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: "12px", padding: "1.5rem", textAlign: "center", color: "#ef4444",
          }}>⚠️ {error}</div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "5rem 0", animation: "fadeUp 0.5s ease both" }}>
            <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🏋️‍♂️</div>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "1.1rem", fontWeight: 600 }}>
              {filter === "All" ? "No workouts yet. Start logging!" : `No ${filter} workouts found.`}
            </p>
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="workout-grid" style={{ animation: "fadeUp 0.6s ease 0.3s both" }}>
            {filtered.map((workout) => (
              <WorkoutCard key={workout._id} workout={workout} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
