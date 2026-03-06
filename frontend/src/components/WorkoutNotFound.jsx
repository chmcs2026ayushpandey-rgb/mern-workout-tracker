import { Link } from "react-router-dom";

export default function WorkoutNotFound() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #0a0a14 0%, #0f0c1e 60%, #0a0a14 100%)",
      fontFamily: "'Syne', sans-serif",
      display: "flex", alignItems: "center", justifyContent: "center",
      textAlign: "center", color: "#fff",
    }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&display=swap');`}</style>
      <div>
        <div style={{
          fontSize: "8rem", fontWeight: 800, letterSpacing: "-0.06em",
          background: "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          lineHeight: 1,
        }}>404</div>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "1.1rem", margin: "1rem 0 2rem" }}>
          Workout not found
        </p>
        <Link to="/" style={{
          background: "linear-gradient(135deg, #f97316, #ef4444)",
          color: "#fff", textDecoration: "none",
          padding: "12px 28px", borderRadius: "10px",
          fontWeight: 700, fontSize: "0.9rem", letterSpacing: "0.04em",
          boxShadow: "0 8px 24px rgba(249,115,22,0.35)",
        }}>Back to Dashboard</Link>
      </div>
    </div>
  );
}
