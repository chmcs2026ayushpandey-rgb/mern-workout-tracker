import Workout from "../models/workoutModel.js";

const ALLOWED_FIELDS = [
  "type",
  "duration",
  "distance",
  "calories",
  "date",
  "notes",
  "exercises",
];
// Only accept known fields, so clients can't set userId themselves
const pick = (body = {}) =>
  Object.fromEntries(
    Object.entries(body).filter(([key]) => ALLOWED_FIELDS.includes(key))
  );

export const createWorkout = async (req, res) => {
  try {
    const workout = await Workout.create({
      ...pick(req.body),
      userId: req.user.id,
    });
    res.status(201).json(workout);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(workouts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getWorkoutById = async (req, res) => {
  try {
    const workout = await Workout.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!workout) {
      return res.status(404).json({ message: "Workout not found" });
    }
    res.json(workout);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateWorkout = async (req, res) => {
  try {
    const workout = await Workout.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      pick(req.body),
      { new: true, runValidators: true }
    );
    if (!workout) {
      return res.status(404).json({ message: "Workout not found" });
    }
    res.json(workout);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteWorkout = async (req, res) => {
  try {
    const workout = await Workout.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!workout) {
      return res.status(404).json({ message: "Workout not found" });
    }
    res.json({ message: "Workout deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};