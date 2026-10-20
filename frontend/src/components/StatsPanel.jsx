import { useMemo } from "react";
import { calcStreaks, toDayKey, todayKey, addDays } from "../lib/utils";

export default function StatsPanel({ workouts }) {
  const stats = useMemo(() => {
    const { current, longest } = calcStreaks(workouts);

    const weekStart = addDays(todayKey(), -6);
    const lastSevenDays = workouts.filter((w) => toDayKey(w.date) >= weekStart).length;

    const avgDuration =
      workouts.length > 0
        ? Math.round(workouts.reduce((s, w) => s + (Number(w.duration) || 0), 0) / workouts.length)
        : 0;

    const counts = {};
    workouts.forEach((w) => {
      counts[w.type] = (counts[w.type] || 0) + 1;
    });
    const favourite = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";

    return { current, longest, lastSevenDays, avgDuration, favourite };
  }, [workouts]);

  const cards = [
    { label: "Current streak", value: `${stats.current} ${stats.current === 1 ? "day" : "days"}`, color: "#f97316", icon: "🔥" },
    { label: "Longest streak", value: `${stats.longest} ${stats.longest === 1 ? "day" : "days"}`, color: "#f59e0b", icon: "🏆" },
    { label: "Last 7 days", value: `${stats.lastSevenDays} workouts`, color: "#3b82f6", icon: "📅" },
    { label: "Avg duration", value: workouts.length ? `${stats.avgDuration} min` : "—", color: "#06b6d4", icon: "⏱" },
    { label: "Favourite", value: stats.favourite, color: "#8b5cf6", icon: "⭐" },
  ];

  return (
    <div style={{ marginBottom: "2rem", fontFamily: "'Syne', sans-serif" }}>
      <div
        style={{
          fontWeight: 800,
          fontSize: "1.05rem",
          marginBottom: "12px",
        }}
      >
        Statistics
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: "12px",
        }}
      >
        {cards.map((c) => (
          <div
            key={c.label}
            style={{
              background: "linear-gradient(145deg, #13131f, #1a1a2e)",
              border: `1px solid ${c.color}22`,
              borderRadius: "14px",
              padding: "1rem",
            }}
          >
            <div style={{ fontSize: "1.2rem", marginBottom: "4px" }}>{c.icon}</div>
            <div style={{ color: c.color, fontWeight: 800, fontSize: "1.05rem" }}>{c.value}</div>
            <div
              style={{
                color: "rgba(255,255,255,0.4)",
                fontSize: "0.68rem",
                fontWeight: 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                marginTop: "2px",
              }}
            >
              {c.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}