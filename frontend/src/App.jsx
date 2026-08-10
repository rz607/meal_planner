import { useEffect, useState } from 'react'

function App() {
  //set useState to null
  const [status, setStatus] = useState(null)

  // useEffect runs code after the component first renders.

  useEffect(() => {
    fetch('http://localhost:8000/api/ping/')   // calls Django endpoint
      .then(res => res.json())                  // parses JSON response
      .then(data => setStatus(data.status))      // saves "ok" into state
  }, [])//useffect runs only once

  //display status
  return <div>Backend status: {status}</div>
}

export default App
