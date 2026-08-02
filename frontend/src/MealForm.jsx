import { useEffect, useState } from "react";
import api from "./api";
import FoodSearch from "./FoodSearch";

function MealForm() {
  const [meals, setMeals] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const fetchMeals = async (pageNum = 1) => {
    try {
      const res = await api.get("/meals", {
        params: { page: pageNum, per_page: 5 },
      });
      setMeals(res.data.items);
      setPage(res.data.page);
      setTotalPages(res.data.total_pages);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchMeals(1);
  }, []);

  const handleLogFood = async (food) => {
    setError("");
    setSuccessMessage("");
    try {
      await api.post("/meals", {
        food_name: food.description,
        calories: food.calories,
        protein: food.protein,
        carbs: food.carbs,
        fats: food.fats,
      });
      setSuccessMessage(`Logged: ${food.description}`);
      fetchMeals(1);
    } catch (err) {
      console.log(err);
      setError("Failed to save meal");
    }
  };

  return (
    <div className="card">
      <h2>Log a Meal</h2>
      <FoodSearch onSelectFood={handleLogFood} />

      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul>
        {meals.map((m) => (
          <li key={m.id} style={{ marginBottom: "0.5rem" }}>
            <strong>
              {m.date}: {m.food_name}
            </strong>
            <br />
            {m.calories != null ? `${m.calories} cal` : "cal N/A"}
            {" | "}
            {m.protein != null ? `${m.protein}g protein` : "protein N/A"}
            {" | "}
            {m.carbs != null ? `${m.carbs}g carbs` : "carbs N/A"}
            {" | "}
            {m.fats != null ? `${m.fats}g fat` : "fat N/A"}
          </li>
        ))}
      </ul>
      <div className="pagination">
        <button disabled={page <= 1} onClick={() => fetchMeals(page - 1)}>
          Prev
        </button>
        <span style={{ margin: "0 1rem" }}>
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page >= totalPages}
          onClick={() => fetchMeals(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default MealForm;