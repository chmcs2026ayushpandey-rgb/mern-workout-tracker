import { fieldStyle } from "../lib/utils";

export const emptyExercise = () => ({ name: "", sets: [{ weight: "", reps: "" }] });

// Converts a saved workout into editable form values
export const exercisesFromWorkout = (workout) =>
  (workout.exercises || []).map((ex) => ({
    name: ex.name,
    sets: ex.sets.map((s) => ({ weight: String(s.weight), reps: String(s.reps) })),
  }));

// Converts form values into the shape the API expects, skipping empty rows
export const exercisesToPayload = (exercises) =>
  exercises
    .filter((ex) => ex.name.trim())
    .map((ex) => ({
      name: ex.name.trim(),
      sets: ex.sets
        .filter((s) => s.weight !== "" && s.reps !== "")
        .map((s) => ({ weight: Number(s.weight), reps: Number(s.reps) })),
    }))
    .filter((ex) => ex.sets.length > 0);

export default function ExerciseEditor({ exercises, onChange }) {
  const updateExercise = (i, patch) =>
    onChange(exercises.map((ex, idx) => (idx === i ? { ...ex, ...patch } : ex)));

  const updateSet = (i, j, patch) =>
    onChange(
      exercises.map((ex, idx) =>
        idx !== i ? ex : { ...ex, sets: ex.sets.map((s, k) => (k === j ? { ...s, ...patch } : s)) }
      )
    );

  const addSet = (i) =>
    onChange(
      exercises.map((ex, idx) =>
        idx === i ? { ...ex, sets: [...ex.sets, { weight: "", reps: "" }] } : ex
      )
    );

  const removeSet = (i, j) =>
    onChange(
      exercises.map((ex, idx) =>
        idx === i ? { ...ex, sets: ex.sets.filter((_, k) => k !== j) } : ex
      )
    );

  const removeExercise = (i) => onChange(exercises.filter((_, idx) => idx !== i));

  const addExercise = () => onChange([...exercises, emptyExercise()]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {exercises.map((ex, i) => (
        <div
          key={i}
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "12px",
            padding: "12px",
          }}
        >
          <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
            <input
              style={{ ...fieldStyle, flex: 1 }}
              placeholder="Exercise (e.g. Bench Press)"
              value={ex.name}
              onChange={(e) => updateExercise(i, { name: e.target.value })}
            />
            <button type="button" onClick={() => removeExercise(i)} style={smallBtn("#ef4444")}>
              ✕
            </button>
          </div>

          {ex.sets.map((s, j) => (
            <div
              key={j}
              style={{
                display: "grid",
                gridTemplateColumns: "40px 1fr 1fr 40px",
                gap: "8px",
                marginBottom: "6px",
                alignItems: "center",
              }}
            >
              <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8rem" }}>#{j + 1}</span>
              <input
                type="number"
                min="0"
                step="0.5"
                placeholder="kg"
                style={fieldStyle}
                value={s.weight}
                onChange={(e) => updateSet(i, j, { weight: e.target.value })}
              />
              <input
                type="number"
                min="1"
                placeholder="reps"
                style={fieldStyle}
                value={s.reps}
                onChange={(e) => updateSet(i, j, { reps: e.target.value })}
              />
              <button type="button" onClick={() => removeSet(i, j)} style={smallBtn("rgba(255,255,255,0.5)")}>
                −
              </button>
            </div>
          ))}

          <button type="button" onClick={() => addSet(i)} style={smallBtn("#f97316")}>
            + Add set
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addExercise}
        style={{ ...smallBtn("#f97316"), alignSelf: "flex-start" }}
      >
        + Add exercise
      </button>
    </div>
  );
}

const smallBtn = (color) => ({
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.1)",
  color,
  borderRadius: "8px",
  padding: "6px 12px",
  fontSize: "0.8rem",
  fontWeight: 700,
  fontFamily: "inherit",
  cursor: "pointer",
});