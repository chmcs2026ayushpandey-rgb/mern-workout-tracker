import Workout from "../models/workoutModel.js";



export const createWorkout = async (req, res) => {
  try {

    const workout = await Workout.create(req.body);

    res.status(201).json(workout);

  } catch (error) {

    res.status(400).json({ message: error.message });

  }
};



export const getWorkouts = async (req, res) => {
  try {

    const workouts = await Workout
      .find()
      .sort({ createdAt: -1 });

    res.status(200).json(workouts);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }
};



export const getWorkoutById = async (req, res) => {
  try {

    const workout = await Workout.findById(req.params.id);

    if (!workout) {

      return res
        .status(404)
        .json({ message: "Workout not found" });

    }

    res.status(200).json(workout);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }
};


export const updateWorkout = async (req, res) => {

  try {

    const workout = await Workout.findByIdAndUpdate(

      req.params.id,

      req.body,

      {
        new: true,
        runValidators: true
      }

    );

    if (!workout) {

      return res
        .status(404)
        .json({ message: "Workout not found" });

    }

    res.status(200).json(workout);

  } catch (error) {

    res.status(400).json({ message: error.message });

  }

};



export const deleteWorkout = async (req, res) => {

  try {

    const workout =
      await Workout.findByIdAndDelete(req.params.id);

    if (!workout) {

      return res
        .status(404)
        .json({ message: "Workout not found" });

    }

    res.status(200).json({

      message: "Workout deleted successfully"

    });

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};
