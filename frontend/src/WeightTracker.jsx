import { useState, useEffect } from "react";
import api from "./api";

const WeightTracker = () => {
    const [weight, setWeight] = useState("");
    const [logs, setLogs] = useState([]);
    const [error, setError] = useState("");

    const fetchLogs = async () => {
        try {
            const response = await api.get("/weight");
            setLogs(response.data);
        } catch (err) {
            console.log(err);
            setError("Failed to fetch weight logs");
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post("/weight", { weight: parseFloat(weight) });
            setWeight("");
            fetchLogs();
        } catch (err) {
            console.log(err);
            setError("Failed to submit weight log");
        }
    };

    return (
        <div>
            <h2>Weight Tracker</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="number"
                    placeholder="Enter weight"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    step="0.1"
                />
                <button type="submit">Submit</button>
            </form>
            <ul>
                {logs.map((log) => (
                    <li key={log.id}>
                        {new Date(log.date).toLocaleDateString()}: {log.weight} lbs
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default WeightTracker;