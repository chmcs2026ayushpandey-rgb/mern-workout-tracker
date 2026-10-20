
import exercises from "../data/exercises.js";

export const getExercises = (req, res) => {
  try {
    let results = [...exercises];

    const { search, category, equipment, difficulty } = req.query;

    if (search?.trim()) {
      const query = search.trim().toLowerCase();

      results = results.filter((exercise) =>
        [
          exercise.name,
          exercise.category,
          ...exercise.muscleGroups,
        ].some((value) => value.toLowerCase().includes(query))
      );
    }

    if (category) {
      results = results.filter(
        (exercise) =>
          exercise.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (equipment) {
      results = results.filter(
        (exercise) =>
          exercise.equipment.toLowerCase() === equipment.toLowerCase()
      );
    }

    if (difficulty) {
      results = results.filter(
        (exercise) =>
          exercise.difficulty.toLowerCase() === difficulty.toLowerCase()
      );
    }

    res.json({
      count: results.length,
      exercises: results,
    });
  } catch {
    res.status(500).json({ message: "Failed to retrieve exercises" });
  }
};
