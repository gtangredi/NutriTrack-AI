import { useState, useEffect } from "react";
import api from "./api";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
);

function Dashboard() {
  const [weightLogs, setWeightLogs] = useState([]);
  const [workoutLogs, setWorkoutLogs] = useState([]);
  const [meals, setMeals] = useState([]);
  const [error, setError] = useState("");

  const fetchWeightLogs = async () => {
    try {
      const response = await api.get("/weight", { params: { per_page: 1000 } });
      setWeightLogs(response.data.items);
    } catch (error) {
      setError("Failed to fetch weight logs");
    }
  };

  const fetchWorkoutLogs = async () => {
    try {
      const response = await api.get("/workouts", { params: { per_page: 1000 } });
      setWorkoutLogs(response.data.items);
    } catch (error) {
      setError("Failed to fetch workout logs");
    }
  };

  const fetchMealLogs = async () => {
    try {
      const response = await api.get("/meals", { params: { per_page: 1000 } });
      setMeals(response.data.items);
    } catch (error) {
      setError("Failed to fetch meal logs");
    }
  };

  useEffect(() => {
    fetchWeightLogs();
    fetchWorkoutLogs();
    fetchMealLogs();
  }, []);

  const weightData = {
    labels: weightLogs.map((log) => new Date(log.date).toLocaleDateString()),
    datasets: [
      {
        label: "Weight (lbs)",
        data: weightLogs.map((log) => log.weight),
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.2,
      },
    ],
  };

  const workoutData = {
    labels: workoutLogs.map((log) => new Date(log.date).toLocaleDateString()),
    datasets: [
      {
        label: "Calories Burned",
        data: workoutLogs.map((log) => log.calories_burned),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
      },
    ],
  };

  // Group meal calories by date, since multiple meals can share a day
  const caloriesByDate = meals.reduce((acc, meal) => {
    const date = meal.date;
    acc[date] = (acc[date] || 0) + (meal.calories || 0);
    return acc;
  }, {});

  const macrosByDate = meals.reduce((acc, meal) => {
    const date = meal.date;
    if (!acc[date]) {
      acc[date] = { protein: 0, carbs: 0, fat: 0 };
    }
    acc[date].protein += meal.protein || 0;
    acc[date].carbs += meal.carbs || 0;
    acc[date].fat += meal.fat || 0;
    return acc;
  }, {});

  const macroDates = Object.keys(macrosByDate);

  const macroChartData = {
    labels: macroDates,
    datasets: [
      {
        label: "Protein (g)",
        data: macroDates.map((d) => macrosByDate[d].protein),
        backgroundColor: "rgba(75, 192, 192, 0.7)",
      },
      {
        label: "Carbs (g)",
        data: macroDates.map((d) => macrosByDate[d].carbs),
        backgroundColor: "rgba(255, 205, 86, 0.7)",
      },
      {
        label: "Fat (g)",
        data: macroDates.map((d) => macrosByDate[d].fat),
        backgroundColor: "rgba(255, 99, 132, 0.7)",
      },
    ],
  };

  const macroChartOptions = {
    scales: {
      x: { stacked: true },
      y: { stacked: true },
    },
  };

  const mealChartData = {
    labels: Object.keys(caloriesByDate),
    datasets: [
      {
        label: "Calories",
        data: Object.values(caloriesByDate),
        backgroundColor: "rgba(255, 159, 64, 0.6)",
      },
    ],
  };

  return (
    <div className="card">
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

      <div>
        <h3>Calories by Day</h3>
        {meals.length > 0 ? (
          <Bar data={mealChartData} />
        ) : (
          <p>No meals logged yet — search and log a meal to see this chart.</p>
        )}
      </div>

      <div>
        <h3>Macros by Day</h3>
        {meals.length > 0 ? (
          <Bar data={macroChartData} options={macroChartOptions} />
        ) : (
          <p>No meals logged yet — log a meal to see your macro breakdown.</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
