import { Routes, Route, useLocation } from 'react-router-dom'
import Homepage from './pages/Homepage'
import SavelMap from './pages/SavelMap'
import Footer from './components/Footer'

import './App.css'

function App() {
  const location = useLocation()
  const showFooter = location.pathname === '/app'

  return (
    <div className="app-shell">
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/app" element={<SavelMap />} />
        </Routes>
      </main>
      {showFooter && <Footer />}
    </div>
  )
}

export default App