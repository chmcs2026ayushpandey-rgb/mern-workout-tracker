import { useEffect, useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import api from "../lib/axios";
import { useToast } from "../context/ToastContext";
import {
  fieldStyle,
  formatDate,
  getErrorMessage,
  calcBMI,
  bmiCategory,
  calcTDEE,
  ACTIVITY_LEVELS,
  todayKey,
} from "../lib/utils";

const emptyForm = () => ({ date: todayKey(), weight: "", height: "" });

export default function BodyPage() {
  const toast = useToast();
  const [measurements, setMeasurements] = useState([]);
  const [form, setForm] = useState(emptyForm());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [calc, setCalc] = useState({ age: "", gender: "male", activity: 1.55, target: "" });

  const load = async () => {
    try {
      const { data } = await api.get("/measurements");
      setMeasurements(data);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Newest first from the API
  const latest = measurements[0];
  const latestHeight = measurements.find((m) => m.height)?.height;
  const bmi = latest && latestHeight ? calcBMI(latest.weight, latestHeight) : null;

  const chartData = useMemo(
    () =>
      [...measurements]
        .reverse()
        .map((m) => ({
          date: new Date(m.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short" }),
          weight: m.weight,
        })),
    [measurements]
  );

  const handleAdd = async (e) => {
    e.preventDefault();
    setError("");

    const weight = Number(form.weight);
    const height = form.height ? Number(form.height) : undefined;
    if (!weight || weight <= 0) {
      setError("Enter your weight in kg");
      return;
    }

    setSaving(true);
    try {
      await api.post("/measurements", {
        date: new Date(form.date).toISOString(),
        weight,
        height,
      });
      toast.success("Measurement saved");
      setForm({ ...emptyForm(), height: form.height });
      load();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this measurement?")) return;
    try {
      await api.delete(`/measurements/${id}`);
      setMeasurements((m) => m.filter((x) => x._id !== id));
      toast.success("Measurement deleted");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  // Calculator results, using the latest weight and height
  const calcResult = (() => {
    if (!latest || !latestHeight || !calc.age) return null;

    const tdee = calcTDEE({
      weightKg: latest.weight,
      heightCm: latestHeight,
      age: Number(calc.age),
      gender: calc.gender,
      activity: Number(calc.activity),
    });

    const target = Number(calc.target);
    if (!target) return { tdee, maintain: tdee };

    const diff = target - latest.weight;
    const direction = diff < 0 ? "lose" : diff > 0 ? "gain" : "maintain";
    const goalCalories = direction === "lose" ? tdee - 500 : direction === "gain" ? tdee + 300 : tdee;
    const ratePerWeek = direction === "lose" ? 0.5 : 0.3;
    const weeks = direction === "maintain" ? 0 : Math.ceil(Math.abs(diff) / ratePerWeek);
    const eta = new Date(Date.now() + weeks * 7 * 24 * 60 * 60 * 1000);

    return { tdee, goalCalories, direction, weeks, eta, ratePerWeek, diff: Math.abs(diff) };
  })();

  const cardStyle = {
    background: "linear-gradient(145deg, #13131f, #1a1a2e)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "16px",
    padding: "1.5rem",
    marginBottom: "1.5rem",
  };

  const labelStyle = {
    color: "rgba(255,255,255,0.55)",
    fontSize: "0.72rem",
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    marginBottom: "6px",
    display: "block",
  };

  return (
    <div style={{ maxWidth: "720px", margin: "0 auto", padding: "2.5rem 1.5rem", fontFamily: "'Syne', sans-serif", color: "#fff" }}>
      <h1 style={{ fontSize: "2.2rem", fontWeight: 800, letterSpacing: "-0.04em" }}>Body</h1>
      <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.9rem", margin: "6px 0 2rem" }}>
        Log your weight and height, check your BMI, and estimate calories.
      </p>

      {/* Summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "12px", marginBottom: "1.5rem" }}>
        <Stat label="Weight" value={latest ? `${latest.weight} kg` : "—"} color="#f97316" />
        <Stat label="Height" value={latestHeight ? `${latestHeight} cm` : "—"} color="#3b82f6" />
        <Stat
          label="BMI"
          value={bmi ? `${bmi.toFixed(1)} · ${bmiCategory(bmi)}` : "—"}
          color="#10b981"
        />
      </div>

      {/* Log form */}
      <form onSubmit={handleAdd} style={{ ...cardStyle, display: "grid", gap: "12px" }}>
        <span style={{ fontWeight: 800 }}>Log a measurement</span>
        {error && <div style={{ color: "#ef4444", fontSize: "0.85rem" }}>⚠️ {error}</div>}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: "10px", alignItems: "end" }}>
          <div>
            <span style={labelStyle}>Date</span>
            <input type="date" style={fieldStyle} value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })} />
          </div>
          <div>
            <span style={labelStyle}>Weight (kg)</span>
            <input type="number" min="1" step="0.1" style={fieldStyle} value={form.weight}
              onChange={(e) => setForm({ ...form, weight: e.target.value })} />
          </div>
          <div>
            <span style={labelStyle}>Height (cm)</span>
            <input type="number" min="1" style={fieldStyle} value={form.height}
              onChange={(e) => setForm({ ...form, height: e.target.value })} />
          </div>
          <button
            type="submit"
            disabled={saving}
            style={{
              padding: "10px 16px",
              borderRadius: "10px",
              border: "none",
              background: "linear-gradient(135deg, #f97316, #ef4444)",
              color: "#fff",
              fontWeight: 800,
              fontFamily: "inherit",
              cursor: saving ? "not-allowed" : "pointer",
            }}
          >
            {saving ? "…" : "Save"}
          </button>
        </div>
      </form>

      {/* Weight chart */}
      {chartData.length >= 2 && (
        <div style={cardStyle}>
          <div style={{ fontWeight: 800, marginBottom: "12px" }}>Weight over time</div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="date" stroke="rgba(255,255,255,0.4)" fontSize={12} />
              <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} unit=" kg" domain={["dataMin - 2", "dataMax + 2"]} />
              <Tooltip
                contentStyle={{ background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#fff" }}
                formatter={(v) => [`${v} kg`, "Weight"]}
              />
              <Line type="monotone" dataKey="weight" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: "#3b82f6" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Calculator */}
      <div style={cardStyle}>
        <div style={{ fontWeight: 800, marginBottom: "12px" }}>Calorie & goal calculator</div>

        {!latest || !latestHeight ? (
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.85rem" }}>
            Log your weight and height above to use the calculator.
          </p>
        ) : (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "10px" }}>
              <div>
                <span style={labelStyle}>Age</span>
                <input type="number" min="10" max="100" style={fieldStyle} value={calc.age}
                  onChange={(e) => setCalc({ ...calc, age: e.target.value })} />
              </div>
              <div>
                <span style={labelStyle}>Gender</span>
                <select style={fieldStyle} value={calc.gender}
                  onChange={(e) => setCalc({ ...calc, gender: e.target.value })}>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "14px" }}>
              <div>
                <span style={labelStyle}>Activity</span>
                <select style={fieldStyle} value={calc.activity}
                  onChange={(e) => setCalc({ ...calc, activity: e.target.value })}>
                  {ACTIVITY_LEVELS.map((a) => (
                    <option key={a.value} value={a.value}>{a.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <span style={labelStyle}>Target weight (kg, optional)</span>
                <input type="number" min="1" step="0.1" style={fieldStyle} value={calc.target}
                  onChange={(e) => setCalc({ ...calc, target: e.target.value })} />
              </div>
            </div>

            {calcResult && (
              <div style={{ display: "grid", gap: "8px", fontSize: "0.9rem" }}>
                <div>Maintenance calories: <strong>{calcResult.tdee} kcal/day</strong></div>
                {calcResult.goalCalories && (
                  <>
                    <div>
                      Daily target to {calcResult.direction}:{" "}
                      <strong>{calcResult.goalCalories} kcal/day</strong>
                    </div>
                    {calcResult.direction !== "maintain" && (
                      <div>
                        Estimated time: <strong>{calcResult.weeks} weeks</strong> at about{" "}
                        {calcResult.ratePerWeek} kg per week (around {calcResult.eta.toLocaleDateString()})
                      </div>
                    )}
                  </>
                )}
                <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.75rem", marginTop: "6px" }}>
                  Estimates only. Use a doctor or dietitian for personal advice.
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* History */}
      <div style={cardStyle}>
        <div style={{ fontWeight: 800, marginBottom: "12px" }}>History</div>
        {loading && <p style={{ color: "rgba(255,255,255,0.4)" }}>Loading…</p>}
        {!loading && measurements.length === 0 && (
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.85rem" }}>No measurements yet.</p>
        )}
        {measurements.map((m) => (
          <div
            key={m._id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px 0",
              borderTop: "1px solid rgba(255,255,255,0.06)",
              fontSize: "0.9rem",
            }}
          >
            <span>
              {formatDate(m.date)} · <strong>{m.weight} kg</strong>
              {m.height ? ` · ${m.height} cm` : ""}
            </span>
            <button
              onClick={() => handleDelete(m._id)}
              style={{ background: "transparent", border: "none", color: "#ef4444", fontWeight: 700, fontFamily: "inherit", cursor: "pointer", fontSize: "0.8rem" }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function Stat({ label, value, color }) {
  return (
    <div style={{ background: "linear-gradient(145deg, #13131f, #1a1a2e)", border: `1px solid ${color}22`, borderRadius: "14px", padding: "1rem" }}>
      <div style={{ color, fontWeight: 800, fontSize: "1.1rem" }}>{value}</div>
      <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", marginTop: "4px" }}>
        {label}
      </div>
    </div>
  );
}