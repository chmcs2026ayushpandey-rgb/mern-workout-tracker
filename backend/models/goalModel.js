import mongoose from "mongoose";

const goalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    goalType: { type: String, enum: ["exercise", "bodyWeight"], required: true },
    exercise: { type: String, trim: true },
    startValue: { type: Number, required: true },
    targetValue: { type: Number, required: true },
    deadline: { type: Date },
    achieved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Goal", goalSchema);