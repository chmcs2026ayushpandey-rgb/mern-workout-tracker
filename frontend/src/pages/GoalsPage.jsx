import { useEffect, useState } from "react";
import api from "../lib/axios";
import { useToast } from "../context/ToastContext";
import {
  bestWeightFor,
  goalProgress,
  getExerciseNames,
  fieldStyle,
  formatDate,
  getErrorMessage,
} from "../lib/utils";

const emptyForm = () => ({
  title: "",
  goalType: "exercise",
  exercise: "",
  targetValue: "",
  deadline: "",
});

export default function GoalsPage() {
  const toast = useToast();
  const [goals, setGoals] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [measurements, setMeasurements] = useState([]);
  const [form, setForm] = useState(emptyForm());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const [g, w, m] = await Promise.all([
        api.get("/goals"),
        api.get("/workouts"),
        api.get("/measurements"),
      ]);
      setGoals(g.data);
      setWorkouts(w.data);
      setMeasurements(m.data);
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

  const latestWeight = measurements.length > 0 ? measurements[0].weight : null;
  const exerciseNames = getExerciseNames(workouts);

  const currentFor = (goal) =>
    goal.goalType === "exercise"
      ? bestWeightFor(workouts, goal.exercise)
      : latestWeight ?? goal.startValue;

  const isAchieved = (goal, current) =>
    goal.goalType === "exercise"
      ? current >= goal.targetValue
      : goal.targetValue < goal.startValue
      ? current <= goal.targetValue
      : current >= goal.targetValue;

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");

    const target = Number(form.targetValue);
    if (!form.title.trim() || !target || target <= 0) {
      setError("Enter a title and a target above 0");
      return;
    }

    let startValue;
    if (form.goalType === "exercise") {
      if (!form.exercise.trim()) {
        setError("Enter the exercise name");
        return;
      }
      startValue = bestWeightFor(workouts, form.exercise);
    } else {
      if (latestWeight == null) {
        setError("Log your body weight on the Body page first");
        return;
      }
      startValue = latestWeight;
    }

    setSaving(true);
    try {
      await api.post("/goals", {
        title: form.title.trim(),
        goalType: form.goalType,
        exercise: form.goalType === "exercise" ? form.exercise.trim() : undefined,
        startValue,
        targetValue: target,
        deadline: form.deadline ? new Date(form.deadline).toISOString() : undefined,
      });
      toast.success("Goal created");
      setForm(emptyForm());
      load();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this goal?")) return;
    try {
      await api.delete(`/goals/${id}`);
      setGoals((g) => g.filter((x) => x._id !== id));
      toast.success("Goal deleted");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div style={{ maxWidth: "720px", margin: "0 auto", padding: "2.5rem 1.5rem", fontFamily: "'Syne', sans-serif", color: "#fff" }}>
      <h1 style={{ fontSize: "2.2rem", fontWeight: 800, letterSpacing: "-0.04em" }}>Goals</h1>
      <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.9rem", margin: "6px 0 2rem" }}>
        Track strength targets and body weight goals.
      </p>

      {/* Create form */}
      <form
        onSubmit={handleCreate}
        style={{
          background: "linear-gradient(145deg, #13131f, #1a1a2e)",
          border: "1px solid rgba(249,115,22,0.2)",
          borderRadius: "16px",
          padding: "1.5rem",
          marginBottom: "2rem",
          display: "grid",
          gap: "12px",
        }}
      >
        {error && (
          <div style={{ color: "#ef4444", fontSize: "0.85rem" }}>⚠️ {error}</div>
        )}

        <input
          style={fieldStyle}
          placeholder="Goal title (e.g. Bench 100 kg)"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <select
            style={fieldStyle}
            value={form.goalType}
            onChange={(e) => setForm({ ...form, goalType: e.target.value })}
          >
            <option value="exercise">Lift weight (exercise)</option>
            <option value="bodyWeight">Body weight</option>
          </select>
          <input
            type="number"
            min="1"
            step="0.5"
            placeholder="Target (kg)"
            style={fieldStyle}
            value={form.targetValue}
            onChange={(e) => setForm({ ...form, targetValue: e.target.value })}
          />
        </div>

        {form.goalType === "exercise" && (
          <>
            <input
              list="exercise-names"
              style={fieldStyle}
              placeholder="Exercise (e.g. Bench Press)"
              value={form.exercise}
              onChange={(e) => setForm({ ...form, exercise: e.target.value })}
            />
            <datalist id="exercise-names">
              {exerciseNames.map((n) => (
                <option key={n} value={n} />
              ))}
            </datalist>
          </>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "12px", alignItems: "center" }}>
          <input
            type="date"
            style={fieldStyle}
            value={form.deadline}
            onChange={(e) => setForm({ ...form, deadline: e.target.value })}
          />
          <button
            type="submit"
            disabled={saving}
            style={{
              padding: "10px 18px",
              borderRadius: "10px",
              border: "none",
              background: "linear-gradient(135deg, #f97316, #ef4444)",
              color: "#fff",
              fontWeight: 800,
              fontFamily: "inherit",
              cursor: saving ? "not-allowed" : "pointer",
            }}
          >
            {saving ? "Saving…" : "Add goal"}
          </button>
        </div>
      </form>

      {/* Goal list */}
      {loading && <p style={{ color: "rgba(255,255,255,0.4)" }}>Loading…</p>}

      {!loading && goals.length === 0 && (
        <p style={{ color: "rgba(255,255,255,0.4)", textAlign: "center", padding: "3rem 0" }}>
          No goals yet. Set your first target above.
        </p>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {goals.map((goal) => {
          const current = currentFor(goal);
          const pct = goalProgress(goal.startValue, current, goal.targetValue);
          const achieved = isAchieved(goal, current);
          const unit = "kg";

          return (
            <div
              key={goal._id}
              style={{
                background: "linear-gradient(145deg, #13131f, #1a1a2e)",
                border: `1px solid ${achieved ? "rgba(16,185,129,0.4)" : "rgba(255,255,255,0.08)"}`,
                borderRadius: "16px",
                padding: "1.25rem",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px" }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: "1.05rem" }}>{goal.title}</div>
                  <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.78rem", marginTop: "2px" }}>
                    {goal.goalType === "exercise" ? goal.exercise : "Body weight"}
                    {goal.deadline && ` · by ${formatDate(goal.deadline)}`}
                  </div>
                </div>
                {achieved && (
                  <span
                    style={{
                      background: "rgba(16,185,129,0.15)",
                      color: "#10b981",
                      borderRadius: "999px",
                      padding: "4px 10px",
                      fontSize: "0.72rem",
                      fontWeight: 700,
                    }}
                  >
                    ✅ Achieved
                  </span>
                )}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", margin: "14px 0 8px", fontSize: "0.85rem" }}>
                <span>
                  Now: <strong>{current} {unit}</strong>
                </span>
                <span style={{ color: "rgba(255,255,255,0.5)" }}>
                  Target: {goal.targetValue} {unit}
                </span>
              </div>

              <div style={{ height: "10px", background: "rgba(255,255,255,0.06)", borderRadius: "999px", overflow: "hidden" }}>
                <div
                  style={{
                    height: "100%",
                    width: `${pct}%`,
                    background: achieved ? "#10b981" : "linear-gradient(90deg, #f97316, #ef4444)",
                    borderRadius: "999px",
                    transition: "width 0.6s ease",
                  }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px" }}>
                <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.78rem" }}>{pct}% of the way</span>
                <button
                  onClick={() => handleDelete(goal._id)}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#ef4444",
                    fontWeight: 700,
                    fontFamily: "inherit",
                    cursor: "pointer",
                    fontSize: "0.8rem",
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}