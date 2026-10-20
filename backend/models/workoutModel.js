import mongoose from "mongoose";

const setSchema = new mongoose.Schema(
  {
    weight: { type: Number, required: true, min: 0 },
    reps: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const exerciseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    sets: { type: [setSchema], default: [] },
  },
  { _id: false }
);

const workoutSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: { type: String, required: true },
    duration: { type: Number, required: true }, // minutes
    distance: { type: Number }, // km
    calories: { type: Number },
    date: { type: Date, required: true },
    notes: { type: String },
    exercises: { type: [exerciseSchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model("Workout", workoutSchema);