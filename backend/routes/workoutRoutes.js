import express from "express";
import {
  createWorkout,
  getWorkouts,
  getWorkoutById,
  updateWorkout,
  deleteWorkout,
} from "../controllers/workoutController.js";

const router = express.Router();

router.post("/", createWorkout);
router.put("/:id", updateWorkout);
router.get("/", getWorkouts);
router.get("/:id", getWorkoutById);
router.delete("/:id", deleteWorkout);

export default router;
