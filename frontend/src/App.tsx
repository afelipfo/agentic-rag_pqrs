import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Dashboard from './components/layout/Dashboard'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App