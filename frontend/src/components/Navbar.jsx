import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLink = (to, label) => {
    const active = location.pathname === to;
    return (
      <Link
        to={to}
        style={{
          color: active ? "#f97316" : "rgba(255,255,255,0.6)",
          textDecoration: "none",
          fontWeight: 700,
          padding: "8px 12px",
          borderRadius: "8px",
          background: active ? "rgba(249,115,22,0.1)" : "transparent",
        }}
      >
        {label}
      </Link>
    );
  };

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "10px",
        padding: "1rem 1.5rem",
        background: "linear-gradient(90deg, #1a1640, #2a1a3e)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        fontFamily: "'Syne', sans-serif",
      }}
    >
      <Link to="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "10px",
            background: "linear-gradient(135deg, #f97316, #ef4444)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontWeight: 800,
          }}
        >
          ⚡
        </div>
        <span style={{ color: "#fff", fontWeight: 800, letterSpacing: "0.05em" }}>
          WORKOUT<span style={{ color: "#f97316" }}>TRACKER</span>
        </span>
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
        {navLink("/", "Home")}
        {navLink("/goals", "Goals")}
        {navLink("/body", "Body")}

        <Link
          to="/create"
          style={{
            color: "#fff",
            textDecoration: "none",
            fontWeight: 700,
            padding: "8px 16px",
            borderRadius: "10px",
            background: "linear-gradient(135deg, #f97316, #ef4444)",
            boxShadow: "0 4px 15px rgba(249,115,22,0.3)",
          }}
        >
          + Add Workout
        </Link>

        <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.85rem" }}>{user.name}</span>

        <button
          onClick={handleLogout}
          style={{
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.15)",
            color: "rgba(255,255,255,0.7)",
            padding: "7px 12px",
            borderRadius: "8px",
            cursor: "pointer",
            fontFamily: "inherit",
            fontWeight: 700,
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}