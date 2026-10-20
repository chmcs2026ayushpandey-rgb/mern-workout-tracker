import mongoose from "mongoose";

const measurementSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    date: { type: Date, required: true },
    weight: { type: Number, required: true, min: 1 }, // kg
    height: { type: Number, min: 1 }, // cm
    notes: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("BodyMeasurement", measurementSchema);