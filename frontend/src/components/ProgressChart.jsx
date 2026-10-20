import { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { getExerciseNames, getExerciseProgress } from "../lib/utils";

export default function ProgressChart({ workouts }) {
  const names = useMemo(() => getExerciseNames(workouts), [workouts]);
  const [selected, setSelected] = useState("");

  const current = names.includes(selected) ? selected : names[0] || "";
  const data = useMemo(
    () => (current ? getExerciseProgress(workouts, current) : []),
    [workouts, current]
  );

  const panelStyle = {
    background: "linear-gradient(145deg, #13131f, #1a1a2e)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "16px",
    padding: "1.25rem",
    marginBottom: "2rem",
    fontFamily: "'Syne', sans-serif",
  };

  if (names.length === 0) {
    return (
      <div style={{ ...panelStyle, color: "rgba(255,255,255,0.4)", fontSize: "0.9rem" }}>
        Log workouts with exercises and sets to see your progress chart.
      </div>
    );
  }

  const best = data.reduce((b, p) => (p.maxWeight > (b?.maxWeight ?? -1) ? p : b), null);

  return (
    <div style={panelStyle}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "10px",
          marginBottom: "1rem",
        }}
      >
        <div>
          <div style={{ fontWeight: 800, fontSize: "1.05rem" }}>Progress</div>
          {best && (
            <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.8rem", marginTop: "2px" }}>
              Personal record:{" "}
              <span style={{ color: "#f97316", fontWeight: 700 }}>{best.maxWeight} kg</span> on {best.date}
            </div>
          )}
        </div>

        <select
          value={current}
          onChange={(e) => setSelected(e.target.value)}
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#fff",
            borderRadius: "8px",
            padding: "6px 10px",
            fontFamily: "inherit",
            fontSize: "0.85rem",
          }}
        >
          {names.map((n) => (
            <option key={n} value={n} style={{ background: "#1a1a2e" }}>
              {n}
            </option>
          ))}
        </select>
      </div>

      {data.length < 2 ? (
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.85rem" }}>
          Log {current} at least twice to see a trend.
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={data}>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis dataKey="date" stroke="rgba(255,255,255,0.4)" fontSize={12} />
            <YAxis
              stroke="rgba(255,255,255,0.4)"
              fontSize={12}
              unit=" kg"
              domain={["dataMin - 5", "dataMax + 5"]}
            />
            <Tooltip
              contentStyle={{
                background: "#1a1a2e",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                color: "#fff",
              }}
              formatter={(v) => [`${v} kg`, "Max weight"]}
            />
            <Line
              type="monotone"
              dataKey="maxWeight"
              stroke="#f97316"
              strokeWidth={3}
              dot={{ r: 4, fill: "#f97316" }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}   