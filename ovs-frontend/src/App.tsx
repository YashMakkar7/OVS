import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/home'
import Dashboard from './pages/dashboard'
import Election from './pages/election'
import ElectionDetail from './pages/electionDetail'

function App() {
  return <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/election" element={<Election />} />
      <Route path="/election/:id" element={<ElectionDetail />} />
    </Routes>
  </Router>
}

export default App
