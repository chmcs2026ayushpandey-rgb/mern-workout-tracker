
import User from "../models/userModel.js";
import exercises from "../data/exercises.js";

// GET /favorites
// Return the logged-in user's favorite exercise IDs.
export const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("favorites");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      favorites: user.favorites || [],
    });
  } catch (error) {
    console.error("Get favorites error:", error);

    res.status(500).json({
      message: "Failed to retrieve favorites",
    });
  }
};

// POST /favorites/:exerciseId
// Add an exercise to the logged-in user's favorites.
export const addFavorite = async (req, res) => {
  try {
    const { exerciseId } = req.params;

    // Make sure the exercise exists in our exercise library.
    const exerciseExists = exercises.some(
      (exercise) => exercise.id === exerciseId
    );

    if (!exerciseExists) {
      return res.status(404).json({
        message: "Exercise not found",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Avoid adding the same favorite more than once.
    if (!user.favorites.includes(exerciseId)) {
      user.favorites.push(exerciseId);
      await user.save();
    }

    res.status(200).json({
      message: "Exercise added to favorites",
      favorites: user.favorites,
    });
  } catch (error) {
    console.error("Add favorite error:", error);

    res.status(500).json({
      message: "Failed to add favorite",
    });
  }
};

// DELETE /favorites/:exerciseId
// Remove an exercise from the logged-in user's favorites.
export const removeFavorite = async (req, res) => {
  try {
    const { exerciseId } = req.params;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.favorites = (user.favorites || []).filter(
      (id) => id !== exerciseId
    );

    await user.save();

    res.status(200).json({
      message: "Exercise removed from favorites",
      favorites: user.favorites,
    });
  } catch (error) {
    console.error("Remove favorite error:", error);

    res.status(500).json({
      message: "Failed to remove favorite",
    });
  }
};
