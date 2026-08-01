import { useState } from "react";
import api from "./api";


function FoodSearch({onSelectFood}) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query) {
            setError("Please enter a search query");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await api.get(`/food/search?q=${query}`);
            setResults(response.data);
        } catch (err) {
            console.error(err);
            setError("Failed to fetch food data");
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Food Search</h2>
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for foods..."
                />
                <button type="submit" disabled={loading}>
                    {loading ? "Searching..." : "Search"}
                </button>
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <div>
                {results.map((food) => (
                    <div key={food.fdcId}>
                        <h3>{food.description}</h3>
                        <p>{food.calories !== undefined ? `Calories: ${food.calories}` : 'Calories: N/A'}</p>
                        <p>{food.protein !== undefined ? `Protein: ${food.protein}g` : 'Protein: N/A'}</p>
                        <p>{food.carbs !== undefined ? `Carbs: ${food.carbs}g` : 'Carbs: N/A'}</p>
                        <p>{food.fats !== undefined ? `Fats: ${food.fats}g` : 'Fats: N/A'}</p>
                        <button onClick={() => onSelectFood(food)}>Add to Log</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default FoodSearch;