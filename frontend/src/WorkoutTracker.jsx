import { useState, useEffect } from "react";
import api from "./api";

function WorkoutTracker() {
    const [workoutType, setWorkoutType] = useState("");
    const [duration, setDuration] = useState("");
    const [caloriesBurned, setCaloriesBurned] = useState("");
    const [workouts, setWorkouts] = useState([]);
    const [error, setError] = useState("");

    const fetchWorkouts = async () => {
        try {
            const response = await api.get("/workouts");
            setWorkouts(response.data);
        } catch (error) {
            setError("Failed to fetch workouts");
        }
    };

    useEffect(() => {
        fetchWorkouts();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post("/workouts", {
                workout_type: workoutType,
                duration: parseFloat(duration),
                calories_burned: parseFloat(caloriesBurned)
            });
            // Refresh the workouts list after adding a new one
            fetchWorkouts();
            // Clear the form fields
            setWorkoutType("");
            setDuration("");
            setCaloriesBurned("");
        } catch (error) {
            setError("Failed to add workout");
        }
    };

    return (
        <div>
            <h2>Workout Tracker</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Workout Type"
                    value={workoutType}
                    onChange={(e) => setWorkoutType(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Duration (minutes)"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Calories Burned"
                    value={caloriesBurned}
                    onChange={(e) => setCaloriesBurned(e.target.value)}
                />
                <button type="submit">Add Workout</button>
            </form>

            <ul>
                {workouts.map((workout) => (
                    <li key={workout.id}>
                        {new Date(workout.date).toLocaleDateString()} - {workout.workout_type}: {workout.duration} minutes, {workout.calories_burned} calories
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default WorkoutTracker;
