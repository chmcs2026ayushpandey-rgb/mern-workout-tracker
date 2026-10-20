import Goal from "../models/goalModel.js";

const ALLOWED_FIELDS = [
  "title",
  "goalType",
  "exercise",
  "startValue",
  "targetValue",
  "deadline",
  "achieved",
];

const pick = (body = {}) =>
  Object.fromEntries(Object.entries(body).filter(([k]) => ALLOWED_FIELDS.includes(k)));

export const getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createGoal = async (req, res) => {
  try {
    const goal = await Goal.create({ ...pick(req.body), userId: req.user.id });
    res.status(201).json(goal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateGoal = async (req, res) => {
  try {
    const goal = await Goal.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      pick(req.body),
      { new: true, runValidators: true }
    );
    if (!goal) return res.status(404).json({ message: "Goal not found" });
    res.json(goal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!goal) return res.status(404).json({ message: "Goal not found" });
    res.json({ message: "Goal deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};