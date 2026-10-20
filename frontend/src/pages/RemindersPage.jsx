
import { useCallback, useEffect, useState } from "react";
import api from "../lib/axios";

const styles = {
  page: {
    minHeight: "100vh",
    padding: "32px 20px",
    background: "linear-gradient(135deg, #100d20, #1c1230)",
    color: "#f5f3ff",
    fontFamily: "Arial, sans-serif",
  },
  container: { maxWidth: "1000px", margin: "0 auto" },
  heading: { fontSize: "32px", marginBottom: "8px" },
  subtitle: { color: "#aaa3bd", marginBottom: "28px" },
  panel: {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "16px",
    padding: "22px",
    marginBottom: "24px",
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px",
    marginTop: "7px",
    borderRadius: "9px",
    border: "1px solid #413553",
    background: "#171225",
    color: "#fff",
    fontSize: "14px",
  },
  label: { display: "block", marginTop: "15px", color: "#d8d1e7" },
  button: {
    border: "none",
    borderRadius: "9px",
    padding: "11px 16px",
    background: "#f97316",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
  },
  secondaryButton: {
    border: "1px solid #574768",
    borderRadius: "9px",
    padding: "9px 12px",
    background: "transparent",
    color: "#eee7fa",
    cursor: "pointer",
  },
  card: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid #342944",
    borderRadius: "12px",
    padding: "18px",
    marginTop: "12px",
  },
};

const emptyForm = { title: "", scheduledAt: "", notes: "" };

function toLocalInputValue(date) {
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

export default function RemindersPage() {
  const [reminders, setReminders] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadReminders = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/reminders");
      setReminders(response.data.reminders || []);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load reminders.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReminders();
  }, [loadReminders]);

  function updateField(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (new Date(form.scheduledAt).getTime() <= Date.now()) {
      setError("Please choose a date and time in the future.");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        title: form.title.trim(),
        scheduledAt: new Date(form.scheduledAt).toISOString(),
        notes: form.notes.trim(),
      };

      if (editingId) {
        await api.patch(`/reminders/${editingId}`, payload);
        setMessage("Reminder updated successfully.");
      } else {
        await api.post("/reminders", payload);
        setMessage("Reminder created successfully.");
      }

      resetForm();
      await loadReminders();
    } catch (err) {
      setError(err.response?.data?.message || "Could not save reminder.");
    } finally {
      setSaving(false);
    }
  }

  function startEditing(reminder) {
    setEditingId(reminder._id);
    setForm({
      title: reminder.title,
      scheduledAt: toLocalInputValue(new Date(reminder.scheduledAt)),
      notes: reminder.notes || "",
    });
    setError("");
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function toggleCompleted(reminder) {
    setError("");
    setMessage("");

    try {
      await api.patch(`/reminders/${reminder._id}`, {
        completed: !reminder.completed,
      });
      setMessage(
        reminder.completed ? "Reminder marked as upcoming." : "Reminder completed!"
      );
      await loadReminders();
    } catch (err) {
      setError(err.response?.data?.message || "Could not update reminder.");
    }
  }

  async function deleteReminder(id) {
    if (!window.confirm("Are you sure you want to delete this reminder?")) {
      return;
    }

    setError("");
    setMessage("");

    try {
      await api.delete(`/reminders/${id}`);

      if (editingId === id) resetForm();

      setMessage("Reminder deleted.");
      await loadReminders();
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete reminder.");
    }
  }

  const upcoming = reminders.filter(
    (item) => !item.completed && new Date(item.scheduledAt) >= new Date()
  );

  const pastDue = reminders.filter(
    (item) => !item.completed && new Date(item.scheduledAt) < new Date()
  );

  const completed = reminders.filter((item) => item.completed);

  function renderReminder(reminder) {
    return (
      <article key={reminder._id} style={styles.card}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <div style={{ flex: "1 1 220px" }}>
            <h3
              style={{
                margin: "0 0 8px",
                textDecoration: reminder.completed ? "line-through" : "none",
              }}
            >
              {reminder.title}
            </h3>

            <p style={{ color: "#c4b8d9", margin: "0 0 8px" }}>
              {new Date(reminder.scheduledAt).toLocaleString()}
            </p>

            {reminder.notes && (
              <p style={{ color: "#aaa3bd", margin: 0 }}>{reminder.notes}</p>
            )}

            {reminder.completed && (
              <p style={{ color: "#4ade80", marginBottom: 0 }}>Completed</p>
            )}
          </div>

          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <button
              type="button"
              style={styles.secondaryButton}
              onClick={() => toggleCompleted(reminder)}
            >
              {reminder.completed ? "Undo" : "Complete"}
            </button>

            <button
              type="button"
              style={styles.secondaryButton}
              onClick={() => startEditing(reminder)}
            >
              Edit
            </button>

            <button
              type="button"
              style={styles.secondaryButton}
              onClick={() => deleteReminder(reminder._id)}
            >
              Delete
            </button>
          </div>
        </div>
      </article>
    );
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.heading}>Workout Reminders</h1>
        <p style={styles.subtitle}>
          Plan your next session. Stay consistent. Keep progressing.
        </p>

        {error && (
          <div role="alert" style={{ ...styles.panel, color: "#fca5a5" }}>
            {error}
          </div>
        )}

        {message && (
          <div role="status" style={{ ...styles.panel, color: "#86efac" }}>
            {message}
          </div>
        )}

        <section style={styles.panel}>
          <h2 style={{ marginTop: 0 }}>
            {editingId ? "Edit reminder" : "Create a reminder"}
          </h2>

          <form onSubmit={handleSubmit}>
            <label style={styles.label} htmlFor="title">
              Workout name
            </label>
            <input
              id="title"
              name="title"
              value={form.title}
              onChange={updateField}
              placeholder="e.g. Upper body workout"
              maxLength={100}
              required
              style={styles.input}
            />

            <label style={styles.label} htmlFor="scheduledAt">
              Date and time
            </label>
            <input
              id="scheduledAt"
              name="scheduledAt"
              type="datetime-local"
              value={form.scheduledAt}
              onChange={updateField}
              min={toLocalInputValue(new Date())}
              required
              style={styles.input}
            />

            <label style={styles.label} htmlFor="notes">
              Notes (optional)
            </label>
            <textarea
              id="notes"
              name="notes"
              value={form.notes}
              onChange={updateField}
              placeholder="e.g. Bring water and resistance bands"
              maxLength={500}
              rows={3}
              style={{ ...styles.input, resize: "vertical" }}
            />

            <div style={{ display: "flex", gap: "10px", marginTop: "18px" }}>
              <button type="submit" disabled={saving} style={styles.button}>
                {saving ? "Saving..." : editingId ? "Save changes" : "Add reminder"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  style={styles.secondaryButton}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section style={styles.panel}>
          <h2 style={{ marginTop: 0 }}>Your schedule</h2>

          {loading ? (
            <p>Loading reminders...</p>
          ) : reminders.length === 0 ? (
            <p style={{ color: "#aaa3bd" }}>
              No reminders yet. Create your first workout reminder above.
            </p>
          ) : (
            <>
              <h3>Upcoming ({upcoming.length})</h3>
              {upcoming.length
                ? upcoming.map(renderReminder)
                : <p style={{ color: "#aaa3bd" }}>No upcoming reminders.</p>}

              <h3 style={{ marginTop: "28px" }}>Past due ({pastDue.length})</h3>
              {pastDue.length
                ? pastDue.map(renderReminder)
                : <p style={{ color: "#aaa3bd" }}>No past-due reminders.</p>}

              <h3 style={{ marginTop: "28px" }}>Completed ({completed.length})</h3>
              {completed.length
                ? completed.map(renderReminder)
                : <p style={{ color: "#aaa3bd" }}>No completed reminders.</p>}
            </>
          )}
        </section>
      </div>
    </main>
  );
}
