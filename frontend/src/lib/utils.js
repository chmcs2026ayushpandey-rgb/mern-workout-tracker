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

// ---------- Volume and weight ----------

// Total volume for one workout: sum of weight × reps across all sets (kg)
export const calcVolume = (workout) =>
  (workout.exercises || []).reduce(
    (total, ex) => total + ex.sets.reduce((s, set) => s + set.weight * set.reps, 0),
    0
  );

// Heaviest weight lifted in any set of one workout (kg)
export const calcMaxWeight = (workout) =>
  Math.max(0, ...(workout.exercises || []).flatMap((ex) => ex.sets.map((s) => s.weight)));

// ---------- Progress chart ----------

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

// ---------- Day keys (YYYY-MM-DD) ----------

// Workouts are saved as UTC midnight of the chosen date, so use UTC here
export const toDayKey = (date) => new Date(date).toISOString().slice(0, 10);

// Today's date in the user's local timezone
export const todayKey = () => {
  const n = new Date();
  const pad = (x) => String(x).padStart(2, "0");
  return `${n.getFullYear()}-${pad(n.getMonth() + 1)}-${pad(n.getDate())}`;
};

export const addDays = (key, n) => {
  const d = new Date(`${key}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};

// ---------- Date range filter ----------

// from / to are "YYYY-MM-DD" strings from date inputs; empty means no limit
export const inDateRange = (date, from, to) => {
  const key = toDayKey(date);
  return (!from || key >= from) && (!to || key <= to);
};

// ---------- Streaks ----------

// current: consecutive days ending today (or yesterday, so the streak isn't lost before you train)
// longest: best run ever
export const calcStreaks = (workouts) => {
  const days = [...new Set(workouts.map((w) => toDayKey(w.date)))].sort();
  if (days.length === 0) return { current: 0, longest: 0 };

  let longest = 1;
  let run = 1;
  for (let i = 1; i < days.length; i++) {
    run = addDays(days[i - 1], 1) === days[i] ? run + 1 : 1;
    longest = Math.max(longest, run);
  }

  const set = new Set(days);
  const today = todayKey();
  let cursor = set.has(today) ? today : set.has(addDays(today, -1)) ? addDays(today, -1) : null;

  let current = 0;
  while (cursor && set.has(cursor)) {
    current++;
    cursor = addDays(cursor, -1);
  }

  return { current, longest };
};

// ---------- Personal records ----------

// A PR is a new top weight for an exercise, beating every earlier workout.
// The first time you log an exercise is the baseline, not a PR.
// Returns { [workoutId]: [{ exercise, weight }, ...] }
export const findPRs = (workouts) => {
  const sorted = [...workouts].sort((a, b) => new Date(a.date) - new Date(b.date));
  const best = {};
  const prs = {};

  for (const w of sorted) {
    for (const ex of w.exercises || []) {
      const top = Math.max(0, ...ex.sets.map((s) => s.weight));
      if (top <= 0) continue;

      if (best[ex.name] === undefined) {
        best[ex.name] = top;
        continue;
      }

      if (top > best[ex.name]) {
        prs[w._id] = [...(prs[w._id] || []), { exercise: ex.name, weight: top }];
        best[ex.name] = top;
      }
    }
  }

  return prs;
};