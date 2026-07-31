import { useState, useEffect } from 'react'
import Login from './Login'


function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);

  if(!loggedInUser) {
    return <Login onLogin={setLoggedInUser} />;
  }

  return (
    <div>
      <h1>Nutritrack AI</h1>
      <p>Welcome, {loggedInUser}!</p>
    </div>
  )
}

export default App
