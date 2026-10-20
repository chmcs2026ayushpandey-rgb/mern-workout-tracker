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