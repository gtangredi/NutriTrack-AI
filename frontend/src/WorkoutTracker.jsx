import { useState, useEffect } from 'react';
import api from './api';

function WorkoutTracker() {
  const [workoutType, setWorkoutType] = useState('');
  const [duration, setDuration] = useState('');
  const [caloriesBurned, setCaloriesBurned] = useState('');
  const [workouts, setWorkouts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState('');

  const fetchWorkouts = async (pageNum = 1) => {
    try {
      const res = await api.get('/workouts', { params: { page: pageNum, per_page: 5 } });
      setWorkouts(res.data.items);
      setPage(res.data.page);
      setTotalPages(res.data.total_pages);
    } catch (err) {
      console.log(err);
      setError('Failed to fetch workouts');
    }
  };

  useEffect(() => {
    fetchWorkouts(1);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/workouts', {
        workout_type: workoutType,
        duration: parseInt(duration),
        calories_burned: caloriesBurned ? parseFloat(caloriesBurned) : null
      });
      setWorkoutType('');
      setDuration('');
      setCaloriesBurned('');
      fetchWorkouts(1);
    } catch (err) {
      console.log(err);
      setError('Failed to log workout');
    }
  };

  return (
    <div className="card">
      <h2>Workout Tracker</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={workoutType}
          onChange={e => setWorkoutType(e.target.value)}
          placeholder="Workout type (e.g. Running)"
        />
        <input
          type="number"
          value={duration}
          onChange={e => setDuration(e.target.value)}
          placeholder="Duration (minutes)"
        />
        <input
          type="number"
          step="0.1"
          value={caloriesBurned}
          onChange={e => setCaloriesBurned(e.target.value)}
          placeholder="Calories burned (optional)"
        />
        <button type="submit">Log Workout</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ul>
        {workouts.map(w => (
          <li key={w.id}>
            {w.date}: {w.workout_type} — {w.duration} min
            {w.calories_burned ? `, ${w.calories_burned} cal burned` : ''}
          </li>
        ))}
      </ul>

      <div className="pagination">
        <button disabled={page <= 1} onClick={() => fetchWorkouts(page - 1)}>Prev</button>
        <span style={{ margin: '0 1rem' }}>Page {page} of {totalPages}</span>
        <button disabled={page >= totalPages} onClick={() => fetchWorkouts(page + 1)}>Next</button>
      </div>
    </div>
  );
}

export default WorkoutTracker;