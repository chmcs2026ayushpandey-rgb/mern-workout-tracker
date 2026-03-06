import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../lib/axios";

function WorkoutDetailPage() {
  const { id } = useParams();
  const [workout, setWorkout] = useState(null);

  useEffect(() => {
    fetchWorkout();
  }, []);

  const fetchWorkout = async () => {
    const res = await axios.get(`/workouts/${id}`);
    setWorkout(res.data);
  };

  if (!workout) {
    return (
      <div className="flex justify-center mt-20">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto card bg-base-100 shadow-xl">
      <div className="card-body">
        <h1 className="card-title text-3xl">
          {workout.title}
        </h1>

        <p className="text-gray-500">
          {workout.description}
        </p>

        <div className="flex gap-4 mt-4">
          <span className="badge badge-primary">
            {workout.duration} minutes
          </span>

          <span className="badge badge-outline">
            {workout.category}
          </span>
        </div>
      </div>
    </div>
  );
}

export default WorkoutDetailPage;