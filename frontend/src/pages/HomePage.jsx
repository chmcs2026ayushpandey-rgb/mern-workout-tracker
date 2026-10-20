
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import WorkoutCard from "../components/WorkoutCard";
import ProgressChart from "../components/ProgressChart";
import StatsPanel from "../components/StatsPanel";
import api from "../lib/axios";
import {
  WORKOUT_TYPES,
  calcVolume,
  fieldStyle,
  findPRs,
  inDateRange,
} from "../lib/utils";

const ALL_TYPES = ["All", ...WORKOUT_TYPES];

const dateInputStyle = {
  ...fieldStyle,
  width: "auto",
  padding: "7px 10px",
  colorScheme: "dark",
};

const featureCards = [
  {
    title: "Exercise Library",
    description:
      "Explore exercises, learn techniques, and access your favorites.",
    icon: "🏋️",
    path: "/exercises",
    action: "Explore exercises",
    color: "#f97316",
  },
  {
    title: "Workout Reminders",
    description:
      "Schedule workouts and manage upcoming training sessions.",
    icon: "⏰",
    path: "/reminders",
    action: "Manage reminders",
    color: "#60a5fa",
  },
  {
    title: "Add Workout",
    description: "Create and log a new training session.",
    icon: "➕",
    path: "/create",
    action: "Create workout",
    color: "#fb923c",
  },
  {
    title: "Fitness Goals",
    description: "Set targets and track your fitness progress.",
    icon: "🎯",
    path: "/goals",
    action: "View goals",
    color: "#a78bfa",
  },
  {
    title: "Body Measurements",
    description: "Record and review your body measurements.",
    icon: "📏",
    path: "/body",
    action: "View measurements",
    color: "#34d399",
  },
];

export default function HomePage() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("All");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  useEffect(() => {
    api
      .get("/workouts")
      .then((res) => {
        setWorkouts(Array.isArray(res.data) ? res.data : []);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load workouts");
        setLoading(false);
      });
  }, []);

  const handleDelete = (id) => {
    setWorkouts((current) =>
      current.filter((workout) => workout._id !== id)
    );
  };

  const handleUpdate = (updated) => {
    setWorkouts((current) =>
      current.map((workout) =>
        workout._id === updated._id ? updated : workout
      )
    );
  };

  // Calculate personal records from the complete workout history.
  const prs = useMemo(() => findPRs(workouts), [workouts]);

  const filtered = workouts.filter(
    (workout) =>
      (filter === "All" || workout.type === filter) &&
      inDateRange(workout.date, from, to)
  );

  const totalMinutes = workouts.reduce(
    (sum, workout) => sum + (Number(workout.duration) || 0),
    0
  );

  const totalCalories = workouts.reduce(
    (sum, workout) => sum + (Number(workout.calories) || 0),
    0
  );

  const totalDistance = workouts.reduce(
    (sum, workout) => sum + (Number(workout.distance) || 0),
    0
  );

  const totalVolume = workouts.reduce(
    (sum, workout) => sum + calcVolume(workout),
    0
  );

  const hasDateFilter = from || to;

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(160deg, #0a0a14 0%, #0f0c1e 50%, #0a0a14 100%)",
        fontFamily: "'Syne', sans-serif",
        color: "#fff",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&display=swap');

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .workout-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.25rem;
        }

        .feature-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1rem;
        }

        .feature-card {
          transition: transform 0.2s ease, border-color 0.2s ease;
        }

        .feature-card:hover {
          transform: translateY(-4px);
        }

        @media(max-width: 640px) {
          .workout-grid {
            grid-template-columns: 1fr;
          }

          .feature-grid {
            grid-template-columns: 1fr;
          }
        }

        .stat-card {
          transition: transform 0.2s;
        }

        .stat-card:hover {
          transform: translateY(-3px);
        }

        .filter-btn:hover {
          opacity: 1 !important;
        }
      `}</style>

      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "2rem 1.5rem",
        }}
      >
        {/* Dashboard heading */}
        <div
          style={{
            marginBottom: "2rem",
            animation: "fadeUp 0.6s ease both",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "8px",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "#10b981",
                boxShadow: "0 0 12px #10b981",
                animation: "pulse 2s infinite",
              }}
            />

            <span
              style={{
                color: "#10b981",
                fontSize: "0.78rem",
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
              }}
            >
              Tracking Active
            </span>
          </div>

          <h1
            style={{
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              lineHeight: 1.1,
              margin: 0,
            }}
          >
            Your Workout
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, #f97316, #ef4444)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Dashboard
            </span>
          </h1>
        </div>

        {/* All feature navigation cards */}
        <div
          className="feature-grid"
          style={{
            marginBottom: "2rem",
            animation: "fadeUp 0.6s ease 0.1s both",
          }}
        >
          {featureCards.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="feature-card"
              style={{
                boxSizing: "border-box",
                minWidth: 0,
                textDecoration: "none",
                color: "#fff",
                background: "linear-gradient(145deg, #201832, #171426)",
                border: `1px solid ${item.color}55`,
                borderRadius: "16px",
                padding: "1.25rem",
                display: "flex",
                alignItems: "flex-start",
                gap: "1rem",
              }}
            >
              <div
                style={{
                  fontSize: "2rem",
                  flexShrink: 0,
                  lineHeight: 1.3,
                }}
              >
                {item.icon}
              </div>

              <div style={{ minWidth: 0 }}>
                <h3
                  style={{
                    margin: "0 0 8px",
                    fontSize: "1rem",
                    fontWeight: 800,
                  }}
                >
                  {item.title}
                </h3>

                <p
                  style={{
                    margin: 0,
                    color: "rgba(255,255,255,0.55)",
                    fontSize: "0.82rem",
                    lineHeight: 1.6,
                  }}
                >
                  {item.description}
                </p>

                <div
                  style={{
                    marginTop: "12px",
                    color: item.color,
                    fontWeight: 700,
                    fontSize: "0.82rem",
                  }}
                >
                  {item.action} →
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Workout totals */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: "1rem",
            marginBottom: "2rem",
            animation: "fadeUp 0.6s ease 0.1s both",
          }}
        >
          {[
            {
              label: "Total Workouts",
              value: workouts.length,
              color: "#f97316",
              icon: "🏋️",
            },
            {
              label: "Total Minutes",
              value: `${totalMinutes}`,
              color: "#3b82f6",
              icon: "⏱",
            },
            {
              label: "Calories Burned",
              value: totalCalories > 0 ? `${totalCalories}` : "—",
              color: "#ef4444",
              icon: "🔥",
            },
            {
              label: "km Covered",
              value: totalDistance > 0 ? totalDistance.toFixed(1) : "—",
              color: "#10b981",
              icon: "📍",
            },
            {
              label: "Total Volume (kg)",
              value:
                totalVolume > 0 ? totalVolume.toLocaleString() : "—",
              color: "#8b5cf6",
              icon: "🏋️",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="stat-card"
              style={{
                background: "linear-gradient(145deg, #13131f, #1a1a2e)",
                border: `1px solid ${stat.color}22`,
                borderRadius: "14px",
                padding: "1.2rem",
              }}
            >
              <div style={{ fontSize: "1.4rem", marginBottom: "6px" }}>
                {stat.icon}
              </div>

              <div
                style={{
                  color: stat.color,
                  fontWeight: 800,
                  fontSize: "1.5rem",
                  letterSpacing: "-0.03em",
                }}
              >
                {stat.value}
              </div>

              <div
                style={{
                  color: "rgba(255,255,255,0.4)",
                  fontSize: "0.73rem",
                  fontWeight: 600,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  marginTop: "2px",
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Existing statistics panel */}
        <StatsPanel workouts={workouts} />

        {/* Workout type filters */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            flexWrap: "wrap",
            marginBottom: "1rem",
            animation: "fadeUp 0.6s ease 0.2s both",
          }}
        >
          {ALL_TYPES.map((type) => (
            <button
              key={type}
              className="filter-btn"
              onClick={() => setFilter(type)}
              style={{
                background:
                  filter === type
                    ? "linear-gradient(135deg,#f97316,#ef4444)"
                    : "rgba(255,255,255,0.05)",
                border:
                  filter === type
                    ? "none"
                    : "1px solid rgba(255,255,255,0.1)",
                color:
                  filter === type ? "#fff" : "rgba(255,255,255,0.55)",
                padding: "6px 16px",
                borderRadius: "20px",
                fontSize: "0.8rem",
                fontWeight: 700,
                fontFamily: "'Syne', sans-serif",
                cursor: "pointer",
                transition: "all 0.2s",
                letterSpacing: "0.03em",
                boxShadow:
                  filter === type
                    ? "0 4px 15px rgba(249,115,22,0.3)"
                    : "none",
                opacity: filter === type ? 1 : 0.8,
              }}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Date filters */}
        <div
          style={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
            flexWrap: "wrap",
            marginBottom: "1.75rem",
          }}
        >
          <span
            style={{
              color: "rgba(255,255,255,0.4)",
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Date
          </span>

          <input
            type="date"
            value={from}
            onChange={(event) => setFrom(event.target.value)}
            style={dateInputStyle}
          />

          <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8rem" }}>
            to
          </span>

          <input
            type="date"
            value={to}
            onChange={(event) => setTo(event.target.value)}
            style={dateInputStyle}
          />

          {hasDateFilter && (
            <button
              onClick={() => {
                setFrom("");
                setTo("");
              }}
              style={{
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "rgba(255,255,255,0.6)",
                borderRadius: "8px",
                padding: "6px 12px",
                fontSize: "0.8rem",
                fontWeight: 700,
                fontFamily: "inherit",
                cursor: "pointer",
              }}
            >
              Clear dates
            </button>
          )}
        </div>

        {/* Existing progress chart */}
        <ProgressChart workouts={workouts} />

        {/* Loading indicator */}
        {loading && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "4rem 0",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                border: "3px solid rgba(249,115,22,0.2)",
                borderTop: "3px solid #f97316",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
              }}
            />
          </div>
        )}

        {/* Error message */}
        {error && (
          <div
            style={{
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: "12px",
              padding: "1.5rem",
              textAlign: "center",
              color: "#ef4444",
            }}
          >
            ⚠️ {error}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && filtered.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "5rem 0",
              animation: "fadeUp 0.5s ease both",
            }}
          >
            <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>
              🏋️‍♂️
            </div>

            <p
              style={{
                color: "rgba(255,255,255,0.4)",
                fontSize: "1.1rem",
                fontWeight: 600,
              }}
            >
              {workouts.length === 0
                ? "No workouts yet. Start logging!"
                : "No workouts match these filters."}
            </p>

            {workouts.length === 0 && (
              <Link
                to="/create"
                style={{
                  display: "inline-block",
                  marginTop: "1rem",
                  padding: "12px 20px",
                  borderRadius: "10px",
                  background: "linear-gradient(135deg, #f97316, #ef4444)",
                  color: "#fff",
                  textDecoration: "none",
                  fontWeight: 800,
                }}
              >
                + Add Your First Workout
              </Link>
            )}
          </div>
        )}

        {/* Existing workout history and editing/deletion */}
        {!loading && !error && filtered.length > 0 && (
          <div
            className="workout-grid"
            style={{ animation: "fadeUp 0.6s ease 0.3s both" }}
          >
            {filtered.map((workout) => (
              <WorkoutCard
                key={workout._id}
                workout={workout}
                prs={prs[workout._id] || []}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
