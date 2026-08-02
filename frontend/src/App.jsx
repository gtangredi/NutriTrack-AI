import { useState, useEffect } from "react";
import Login from "./Login";
import WeightTracker from "./WeightTracker";
import WorkoutTracker from "./WorkoutTracker";
import Dashboard from "./Dashboard";
import MealForm from "./MealForm";

function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const username = localStorage.getItem("username");
    if (token && username) {
      setLoggedInUser(username);
    }
    setCheckingAuth(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("username");
    setLoggedInUser(null);
  };

  if (checkingAuth) {
    return <div>Loading...</div>;
  }

  if (!loggedInUser) {
    return <Login onLogin={setLoggedInUser} />;
  }

  return (
    <div className="app-container">
      <header>
        <h1>Nutritrack AI</h1>
        <h1>Welcome, {loggedInUser}!</h1>
        <button onClick={handleLogout}>Logout</button> 
      </header>
      <Dashboard />
      <MealForm />
      <WeightTracker />
      <WorkoutTracker />
    </div>
  );
}

export default App;
