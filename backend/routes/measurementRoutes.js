import express from "express";
import {
  getMeasurements,
  createMeasurement,
  deleteMeasurement,
} from "../controllers/measurementController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.route("/").get(getMeasurements).post(createMeasurement);
router.route("/:id").delete(deleteMeasurement);

export default router;