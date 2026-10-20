import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { fieldStyle, getErrorMessage } from "../lib/utils";

export default function AuthPage({ mode }) {
  const isLogin = mode === "login";
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isLogin) {
        await login(form.email, form.password);
      } else {
        await register(form.name, form.email, form.password);
      }
      navigate("/");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg, #0a0a14 0%, #0f0c1e 60%, #0a0a14 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
        fontFamily: "'Syne', sans-serif",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: "100%",
          maxWidth: "380px",
          background: "linear-gradient(145deg, #13131f, #1a1a2e)",
          border: "1px solid rgba(249,115,22,0.2)",
          borderRadius: "18px",
          padding: "2rem",
          display: "flex",
          flexDirection: "column",
          gap: "14px",
        }}
      >
        <h1
          style={{
            fontSize: "1.8rem",
            fontWeight: 800,
            background: "linear-gradient(135deg, #fff 40%, #f97316)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {isLogin ? "Welcome back" : "Create account"}
        </h1>

        {error && (
          <div
            style={{
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: "10px",
              padding: "10px 14px",
              color: "#ef4444",
              fontSize: "0.85rem",
            }}
          >
            ⚠️ {error}
          </div>
        )}

        {!isLogin && (
          <input
            style={fieldStyle}
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        )}
        <input
          type="email"
          style={fieldStyle}
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          type="password"
          style={fieldStyle}
          placeholder="Password (min 6 characters)"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />

        <button
          disabled={loading}
          style={{
            marginTop: "6px",
            padding: "13px",
            borderRadius: "12px",
            border: "none",
            background: "linear-gradient(135deg, #f97316, #ef4444)",
            color: "#fff",
            fontWeight: 800,
            fontSize: "1rem",
            fontFamily: "inherit",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? "Please wait…" : isLogin ? "Login" : "Register"}
        </button>

        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.85rem", textAlign: "center" }}>
          {isLogin ? (
            <>No account? <Link to="/register" style={{ color: "#f97316", fontWeight: 700 }}>Register</Link></>
          ) : (
            <>Already have an account? <Link to="/login" style={{ color: "#f97316", fontWeight: 700 }}>Login</Link></>
          )}
        </p>
      </form>
    </div>
  );
}