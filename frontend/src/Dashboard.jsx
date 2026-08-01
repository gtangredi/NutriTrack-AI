import { useState, useEffect } from "react";
import api from "./api";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    BarElement
);

function Dashboard() {
    const [weightLogs, setWeightLogs] = useState([]);
    const [workoutLogs, setWorkoutLogs] = useState([]);
    const [error, setError] = useState("");

    const fetchWeightLogs = async () => {
        try {
            const response = await api.get("/weight");
            setWeightLogs(response.data);
        } catch (error) {
            setError("Failed to fetch weight logs");
        }
    };

    const fetchWorkoutLogs = async () => {
        try {
            const response = await api.get("/workouts");
            setWorkoutLogs(response.data);
        } catch (error) {
            setError("Failed to fetch workout logs");
        }
    };

    useEffect(() => {
        fetchWeightLogs();
        fetchWorkoutLogs();
    }, []);

    const weightData = {
        labels: weightLogs.map(log => new Date(log.date).toLocaleDateString()),
        datasets: [
            {
                label: "Weight (lbs)",
                data: weightLogs.map(log => log.weight),
                borderColor: "rgb(75, 192, 192)",
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                tension: 0.2
            }
        ]
    };

    const workoutData = {
        labels: workoutLogs.map(log => new Date(log.date).toLocaleDateString()),
        datasets: [
            {
                label: "Calories Burned",
                data: workoutLogs.map(log => log.calories_burned),
                borderColor: "rgb(255, 99, 132)",
                backgroundColor: "rgba(255, 99, 132, 0.2)"
            }
        ]
    };

    return (
        <div>
            <h2>Dashboard</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <div>
                <h3>Weight Logs</h3>
                {weightLogs.length > 0 ? (
                    <Line data={weightData} />
                ) : (
                    <p>No weight logs available.</p>
                )}
            </div>
            <div>
                <h3>Workout Logs</h3>
                {workoutLogs.length > 0 ? (
                    <Bar data={workoutData} />
                ) : (
                    <p>No workout logs available.</p>
                )}
            </div>
        </div>
    );
}

export default Dashboard;
