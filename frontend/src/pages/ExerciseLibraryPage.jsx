import { useEffect, useState } from "react";
import api from "../lib/axios";

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(160deg, #0a0a14 0%, #0f0c1e 50%, #0a0a14 100%)",
    fontFamily: "'Syne', sans-serif",
    color: "#fff",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "2rem 1.5rem",
  },
  eyebrow: {
    color: "#10b981",
    fontSize: "0.78rem",
    fontWeight: 700,
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    marginBottom: "10px",
  },
  title: {
    fontSize: "clamp(2rem, 5vw, 3.5rem)",
    fontWeight: 800,
    letterSpacing: "-0.04em",
    lineHeight: 1.1,
    margin: 0,
  },
  subtitle: {
    color: "rgba(255,255,255,0.45)",
    marginTop: "14px",
    fontSize: "0.95rem",
    lineHeight: 1.7,
  },
  panel: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "12px",
    margin: "2rem 0",
    padding: "1rem",
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.025)",
    borderRadius: "16px",
  },
  field: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px 14px",
    background: "#13131f",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "10px",
    color: "#fff",
    fontFamily: "inherit",
    fontSize: "0.9rem",
    outline: "none",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
    gap: "1.25rem",
  },
  card: {
    background: "linear-gradient(145deg, #13131f, #1a1a2e)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "16px",
    padding: "1.35rem",
    minWidth: 0,
    transition: "transform 0.2s, border-color 0.2s",
  },
  muted: {
    color: "rgba(255,255,255,0.45)",
    fontSize: "0.83rem",
    lineHeight: 1.7,
  },
  sectionLabel: {
    color: "rgba(255,255,255,0.4)",
    fontSize: "0.7rem",
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    marginBottom: "8px",
  },
  button: {
    background: "linear-gradient(135deg, #f97316, #ef4444)",
    border: "none",
    color: "#fff",
    borderRadius: "10px",
    padding: "10px 16px",
    fontFamily: "inherit",
    fontWeight: 700,
    cursor: "pointer",
  },
};

export default function ExerciseLibraryPage() {
  const [exercises, setExercises] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function fetchExercises() {
      setLoading(true);
      setError("");

      try {
        const response = await api.get("/exercises", {
          params: {
            search: search.trim() || undefined,
            category: category || undefined,
          },
        });

        const data = response.data;
        const list = Array.isArray(data) ? data : data.exercises || [];

        if (!cancelled) setExercises(list);
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.message ||
              "Unable to load exercises. Please try again."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchExercises();

    return () => {
      cancelled = true;
    };
  }, [search, category]);

  const categories = [
    ...new Set(
      exercises.map((exercise) => exercise.category).filter(Boolean)
    ),
  ];

  return (
    <div style={styles.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&display=swap');

        @keyframes exerciseFadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .exercise-card:hover {
          transform: translateY(-3px);
          border-color: rgba(249,115,22,0.35) !important;
        }

        .exercise-field:focus {
          border-color: #f97316 !important;
        }

        .exercise-field option {
          background: #13131f;
          color: #fff;
        }
      `}</style>

      <main style={styles.container}>
        <header
          style={{
            marginBottom: "2rem",
            animation: "exerciseFadeUp 0.5s ease both",
          }}
        >
          <div style={styles.eyebrow}>✦ TRAIN SMARTER</div>

          <h1 style={styles.title}>
            Exercise{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #f97316, #ef4444)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Library
            </span>
          </h1>

          <p style={styles.subtitle}>
            Discover movements, learn proper technique, and build better
            workouts.
          </p>
        </header>

        <section style={styles.panel}>
          <input
            className="exercise-field"
            type="search"
            aria-label="Search exercises"
            placeholder="Search exercises..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            style={styles.field}
          />

          <select
            className="exercise-field"
            aria-label="Filter by category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            style={styles.field}
          >
            <option value="">All categories</option>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </section>

        {!loading && !error && (
          <p style={{ ...styles.muted, marginBottom: "1.25rem" }}>
            Showing{" "}
            <strong style={{ color: "#f97316" }}>{exercises.length}</strong>{" "}
            exercise{exercises.length === 1 ? "" : "s"}
          </p>
        )}

        {loading ? (
          <p style={{ ...styles.muted, padding: "3rem 0" }}>
            Loading exercises...
          </p>
        ) : error ? (
          <div
            style={{
              ...styles.card,
              borderColor: "rgba(239,68,68,0.3)",
              color: "#fca5a5",
            }}
          >
            {error}
          </div>
        ) : exercises.length === 0 ? (
          <div style={{ ...styles.card, textAlign: "center", padding: "3rem 1rem" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🔎</div>
            <h2 style={{ fontSize: "1.2rem", margin: 0 }}>
              No exercises found
            </h2>
            <p style={styles.muted}>
              Try another search or clear your filters.
            </p>
            <button
              type="button"
              style={styles.button}
              onClick={() => {
                setSearch("");
                setCategory("");
              }}
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div style={styles.grid}>
            {exercises.map((exercise) => (
              <article
                key={exercise.id || exercise._id || exercise.name}
                className="exercise-card"
                style={{
                  ...styles.card,
                  animation: "exerciseFadeUp 0.45s ease both",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "8px",
                    marginBottom: "1rem",
                  }}
                >
                  <span
                    style={{
                      background: "rgba(249,115,22,0.12)",
                      color: "#fb923c",
                      border: "1px solid rgba(249,115,22,0.18)",
                      borderRadius: "20px",
                      padding: "5px 11px",
                      fontSize: "0.72rem",
                      fontWeight: 700,
                    }}
                  >
                    {exercise.category || "General"}
                  </span>

                  <span style={{ ...styles.muted, fontSize: "0.73rem" }}>
                    {exercise.difficulty || "All levels"}
                  </span>
                </div>

                <h2
                  style={{
                    fontSize: "1.3rem",
                    fontWeight: 800,
                    letterSpacing: "-0.025em",
                    margin: "0 0 1.1rem",
                  }}
                >
                  {exercise.name}
                </h2>

                {Array.isArray(exercise.muscleGroups) &&
                  exercise.muscleGroups.length > 0 && (
                    <div style={{ marginBottom: "1rem" }}>
                      <div style={styles.sectionLabel}>Muscle groups</div>
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "6px",
                        }}
                      >
                        {exercise.muscleGroups.map((muscle) => (
                          <span
                            key={muscle}
                            style={{
                              padding: "5px 8px",
                              background: "rgba(255,255,255,0.045)",
                              border: "1px solid rgba(255,255,255,0.06)",
                              borderRadius: "7px",
                              fontSize: "0.72rem",
                              color: "rgba(255,255,255,0.7)",
                            }}
                          >
                            {muscle}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                {exercise.equipment && (
                  <p style={{ ...styles.muted, marginBottom: "1rem" }}>
                    <span style={{ color: "rgba(255,255,255,0.65)" }}>
                      Equipment:{" "}
                    </span>
                    {exercise.equipment}
                  </p>
                )}

                {exercise.instructions && (
                  <div
                    style={{
                      borderTop: "1px solid rgba(255,255,255,0.08)",
                      paddingTop: "1rem",
                      marginTop: "0.5rem",
                    }}
                  >
                    <h3
                      style={{
                        fontSize: "0.85rem",
                        fontWeight: 700,
                        margin: "0 0 0.75rem",
                      }}
                    >
                      How to perform
                    </h3>

                    <ol
                      style={{
                        paddingLeft: "1.2rem",
                        margin: 0,
                        color: "rgba(255,255,255,0.55)",
                        fontSize: "0.8rem",
                        lineHeight: 1.8,
                      }}
                    >
                      {(Array.isArray(exercise.instructions)
                        ? exercise.instructions
                        : [exercise.instructions]
                      ).map((instruction, index) => (
                        <li key={index} style={{ paddingLeft: "3px", marginBottom: "5px" }}>
                          {instruction}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                {exercise.tips && (
                  <div
                    style={{
                      marginTop: "1.1rem",
                      padding: "12px",
                      borderRadius: "10px",
                      background: "rgba(16,185,129,0.07)",
                      border: "1px solid rgba(16,185,129,0.15)",
                    }}
                  >
                    <div
                      style={{
                        color: "#10b981",
                        fontSize: "0.7rem",
                        fontWeight: 800,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        marginBottom: "5px",
                      }}
                    >
                      ✓ Training tip
                    </div>
                    <p
                      style={{
                        margin: 0,
                        color: "rgba(255,255,255,0.68)",
                        fontSize: "0.8rem",
                        lineHeight: 1.6,
                      }}
                    >
                      {exercise.tips}
                    </p>
                  </div>
                )}

                {Array.isArray(exercise.mistakes) &&
                  exercise.mistakes.length > 0 && (
                    <details style={{ marginTop: "1rem" }}>
                      <summary
                        style={{
                          cursor: "pointer",
                          color: "#fca5a5",
                          fontSize: "0.8rem",
                          fontWeight: 700,
                        }}
                      >
                        Common mistakes
                      </summary>
                      <ul
                        style={{
                          paddingLeft: "1.2rem",
                          color: "rgba(255,255,255,0.55)",
                          fontSize: "0.8rem",
                          lineHeight: 1.8,
                        }}
                      >
                        {exercise.mistakes.map((mistake) => (
                          <li key={mistake}>{mistake}</li>
                        ))}
                      </ul>
                    </details>
                  )}
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}