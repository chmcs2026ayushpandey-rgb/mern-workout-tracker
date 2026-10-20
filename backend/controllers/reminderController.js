
import Reminder from "../models/reminderModel.js";

export const getReminders = async (req, res) => {
  try {
    const reminders = await Reminder.find({ user: req.user.id })
      .sort({ scheduledAt: 1 });

    res.status(200).json({ reminders });
  } catch (error) {
    console.error("Get reminders error:", error);
    res.status(500).json({ message: "Failed to retrieve reminders" });
  }
};

export const createReminder = async (req, res) => {
  try {
    const { title, scheduledAt, notes } = req.body;

    if (!title?.trim() || !scheduledAt) {
      return res.status(400).json({
        message: "Title and scheduled date/time are required",
      });
    }

    const date = new Date(scheduledAt);

    if (Number.isNaN(date.getTime())) {
      return res.status(400).json({
        message: "Invalid scheduled date/time",
      });
    }

    const reminder = await Reminder.create({
      user: req.user.id,
      title: title.trim(),
      scheduledAt: date,
      notes: notes || "",
    });

    res.status(201).json({
      message: "Reminder created successfully",
      reminder,
    });
  } catch (error) {
    console.error("Create reminder error:", error);
    res.status(500).json({ message: "Failed to create reminder" });
  }
};

export const updateReminder = async (req, res) => {
  try {
    const { title, scheduledAt, notes, completed } = req.body;
    const updates = {};

    if (title !== undefined) {
      if (typeof title !== "string" || !title.trim()) {
        return res.status(400).json({ message: "Title cannot be empty" });
      }
      updates.title = title.trim();
    }

    if (scheduledAt !== undefined) {
      const date = new Date(scheduledAt);

      if (Number.isNaN(date.getTime())) {
        return res.status(400).json({
          message: "Invalid scheduled date/time",
        });
      }

      updates.scheduledAt = date;
    }

    if (notes !== undefined) {
      updates.notes = notes;
    }

    if (completed !== undefined) {
      if (typeof completed !== "boolean") {
        return res.status(400).json({
          message: "Completed must be true or false",
        });
      }
      updates.completed = completed;
    }

    const reminder = await Reminder.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!reminder) {
      return res.status(404).json({ message: "Reminder not found" });
    }

    res.status(200).json({
      message: "Reminder updated successfully",
      reminder,
    });
  } catch (error) {
    console.error("Update reminder error:", error);
    res.status(500).json({ message: "Failed to update reminder" });
  }
};

export const deleteReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!reminder) {
      return res.status(404).json({ message: "Reminder not found" });
    }

    res.status(200).json({ message: "Reminder deleted successfully" });
  } catch (error) {
    console.error("Delete reminder error:", error);
    res.status(500).json({ message: "Failed to delete reminder" });
  }
};
