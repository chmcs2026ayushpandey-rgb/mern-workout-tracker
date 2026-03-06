import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  return (
    <nav style={{
      background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
      borderBottom: "1px solid rgba(255,255,255,0.08)",
      padding: "0 2rem",
      height: "64px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      position: "sticky",
      top: 0,
      zIndex: 100,
      backdropFilter: "blur(12px)",
      fontFamily: "'Syne', sans-serif",
    }}>
      <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{
          width: "36px", height: "36px",
          background: "linear-gradient(135deg, #f97316, #ef4444)",
          borderRadius: "10px",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 0 20px rgba(249,115,22,0.4)",
        }}>
          <svg width="20" height="20" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
          </svg>
        </div>
        <span style={{ color: "#fff", fontSize: "1.25rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
          WORKOUT<span style={{ color: "#f97316" }}>TRACKER</span>
        </span>
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <NavLink to="/" active={location.pathname === "/"}>Home</NavLink>
        <NavLink to="/create" active={location.pathname === "/create"}>
          <span style={{
            background: "linear-gradient(135deg, #f97316, #ef4444)",
            color: "white",
            padding: "8px 18px",
            borderRadius: "8px",
            fontWeight: 700,
            fontSize: "0.85rem",
            letterSpacing: "0.04em",
            display: "flex", alignItems: "center", gap: "6px",
            boxShadow: "0 4px 15px rgba(249,115,22,0.35)",
            transition: "all 0.2s",
          }}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="7" y1="1" x2="7" y2="13"/><line x1="1" y1="7" x2="13" y2="7"/>
            </svg>
            Add Workout
          </span>
        </NavLink>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Space+Mono:wght@400;700&display=swap');
      `}</style>
    </nav>
  );
}

function NavLink({ to, children, active }) {
  return (
    <Link to={to} style={{ textDecoration: "none" }}>
      <span style={{
        color: active ? "#f97316" : "rgba(255,255,255,0.65)",
        fontWeight: 600,
        fontSize: "0.9rem",
        padding: "6px 14px",
        borderRadius: "6px",
        background: active ? "rgba(249,115,22,0.1)" : "transparent",
        transition: "all 0.2s",
        letterSpacing: "0.02em",
      }}>{children}</span>
    </Link>
  );
}
