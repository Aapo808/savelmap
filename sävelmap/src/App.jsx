import { Routes, Route } from 'react-router-dom'
import Homepage from './pages/Homepage'
import SavelMap from './pages/SavelMap'

import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/app" element={<SavelMap />} />
    </Routes>
  )
}

export default App