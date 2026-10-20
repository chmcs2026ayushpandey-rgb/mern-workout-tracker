import mongoose from "mongoose";

const workoutSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      required: true,
    },
    duration: {
      type: Number, // minutes
      required: true,
    },
    distance: {
      type: Number, // km
    },
    calories: {
      type: Number,
    },
    date: {
      type: Date,
      required: true,
    },
    notes: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Workout", workoutSchema);