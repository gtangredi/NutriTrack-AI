import { useState } from 'react'
import Login from './Login'
import WeightTracker from './WeightTracker'
import WorkoutTracker from './WorkoutTracker'
import Dashboard from './Dashboard'

function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);

  if(!loggedInUser) {
    return <Login onLogin={setLoggedInUser} />;
  }

  return (
    <div>
      <h1>Nutritrack AI</h1>
      <p>Welcome, {loggedInUser}!</p>
      <WeightTracker /> 
      <WorkoutTracker />
      <Dashboard />
    </div>
  )
}

export default App
