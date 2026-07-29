import { useState, useEffect } from 'react'
import axios from 'axios'


function App() {
  const [status, setStatus] = useState("")

  useEffect(() => {
    axios.get('http://localhost:5000/api/health')
      .then(response => {
        setStatus("backend reachable")
      })
      .catch(error => {
        console.error('Error fetching health status:', error)
        setStatus('backend not reachable')
      })
  }, [])

  return (
    <div>
      <h1>Nutritrack AI</h1>
      <p>Backend status: {status}</p>
    </div>
  )
}

export default App
