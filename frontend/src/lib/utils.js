export const WORKOUT_TYPES = [
  "Running",
  "Cycling",
  "Swimming",
  "Weightlifting",
  "Yoga",
  "HIIT",
  "Walking",
  "Other",
];

export const TYPE_COLORS = {
  Running: "#f97316",
  Cycling: "#3b82f6",
  Swimming: "#06b6d4",
  Weightlifting: "#ef4444",
  Yoga: "#8b5cf6",
  HIIT: "#f59e0b",
  Walking: "#10b981",
  Other: "#6b7280",
};

export const TYPE_ICONS = {
  Running: "🏃",
  Cycling: "🚴",
  Swimming: "🏊",
  Weightlifting: "🏋️",
  Yoga: "🧘",
  HIIT: "⚡",
  Walking: "🚶",
  Other: "💪",
};

export const fieldStyle = {
  width: "100%",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "10px",
  padding: "10px 12px",
  color: "#fff",
  fontSize: "0.9rem",
  fontFamily: "inherit",
  outline: "none",
};

export const formatDate = (date) => new Date(date).toLocaleDateString();

export const getErrorMessage = (err, fallback = "Something went wrong") =>
  err.response?.data?.message || err.message || fallback;

// Total volume for one workout: sum of weight × reps across all sets (kg)
export const calcVolume = (workout) =>
  (workout.exercises || []).reduce(
    (total, ex) => total + ex.sets.reduce((s, set) => s + set.weight * set.reps, 0),
    0
  );

// Heaviest weight lifted in any set of one workout (kg)
export const calcMaxWeight = (workout) =>
  Math.max(0, ...(workout.exercises || []).flatMap((ex) => ex.sets.map((s) => s.weight)));

// Distinct exercise names across all workouts, alphabetical
export const getExerciseNames = (workouts) =>
  [...new Set(workouts.flatMap((w) => (w.exercises || []).map((e) => e.name)))].sort();

// One point per workout that included the exercise, oldest first
export const getExerciseProgress = (workouts, name) =>
  workouts
    .filter((w) => (w.exercises || []).some((e) => e.name === name))
    .map((w) => {
      const ex = w.exercises.find((e) => e.name === name);
      const time = new Date(w.date);
      return {
        date: time.toLocaleDateString("en-GB", { day: "2-digit", month: "short" }),
        timestamp: time.getTime(),
        maxWeight: Math.max(0, ...ex.sets.map((s) => s.weight)),
        volume: ex.sets.reduce((s, set) => s + set.weight * set.reps, 0),
      };
    })
    .sort((a, b) => a.timestamp - b.timestamp);