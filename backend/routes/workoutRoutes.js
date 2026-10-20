import express from "express";
import {
  createWorkout,
  getWorkouts,
  getWorkoutById,
  updateWorkout,
  deleteWorkout,
} from "../controllers/workoutController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// every workout route requires a valid token
router.use(protect);

router.route("/").get(getWorkouts).post(createWorkout);
router
  .route("/:id")
  .get(getWorkoutById)
  .put(updateWorkout)
  .delete(deleteWorkout);

export default router;