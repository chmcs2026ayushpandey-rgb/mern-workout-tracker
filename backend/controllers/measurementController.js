import BodyMeasurement from "../models/measurementModel.js";

const ALLOWED_FIELDS = ["date", "weight", "height", "notes"];

const pick = (body = {}) =>
  Object.fromEntries(Object.entries(body).filter(([k]) => ALLOWED_FIELDS.includes(k)));

// Newest first, so measurements[0] is always the latest
export const getMeasurements = async (req, res) => {
  try {
    const list = await BodyMeasurement.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createMeasurement = async (req, res) => {
  try {
    const m = await BodyMeasurement.create({ ...pick(req.body), userId: req.user.id });
    res.status(201).json(m);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteMeasurement = async (req, res) => {
  try {
    const m = await BodyMeasurement.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!m) return res.status(404).json({ message: "Measurement not found" });
    res.json({ message: "Measurement deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};