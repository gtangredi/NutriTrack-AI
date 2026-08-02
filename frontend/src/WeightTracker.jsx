import { useState, useEffect } from 'react';
import api from './api';

function WeightTracker() {
  const [weight, setWeight] = useState('');
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState('');

  const fetchLogs = async (pageNum = 1) => {
    try {
      const res = await api.get('/weight', { params: { page: pageNum, per_page: 5 } });
      setLogs(res.data.items);
      setPage(res.data.page);
      setTotalPages(res.data.total_pages);
    } catch (err) {
      console.log(err);
      setError('Failed to fetch weight logs');
    }
  };

  useEffect(() => {
    fetchLogs(1);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/weight', { weight: parseFloat(weight) });
      setWeight('');
      fetchLogs(1);
    } catch (err) {
      console.log(err);
      setError('Failed to log weight');
    }
  };

  return (
    <div className="card">
      <h2>Weight Tracker</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          step="0.1"
          value={weight}
          onChange={e => setWeight(e.target.value)}
          placeholder="Weight (lbs)"
        />
        <button type="submit">Log Weight</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ul>
        {logs.map(log => (
          <li key={log.id}>{log.date}: {log.weight} lbs</li>
        ))}
      </ul>

      <div className="pagination">
        <button disabled={page <= 1} onClick={() => fetchLogs(page - 1)}>Prev</button>
        <span style={{ margin: '0 1rem' }}>Page {page} of {totalPages}</span>
        <button disabled={page >= totalPages} onClick={() => fetchLogs(page + 1)}>Next</button>
      </div>
    </div>
  );
}

export default WeightTracker;