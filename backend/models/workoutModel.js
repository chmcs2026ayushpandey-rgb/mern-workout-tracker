import mongoose from "mongoose";

const workoutSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    duration: {
      type: Number, // in minutes
      required: true,
    },
    distance: {
      type: Number, // in km
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
  { timestamps: true } // createdAt & updatedAt
);

export default mongoose.model("Workout", workoutSchema);
