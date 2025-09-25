import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import Dashboard from './components/layout/Dashboard'
import LandingPage from './components/layout/LandingPage'

function AppContent() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-background">
      <Routes>
        <Route path="/" element={<LandingPage onEnterDashboard={() => navigate('/dashboard')} />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App