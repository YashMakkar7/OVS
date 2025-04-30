import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Admin/home'
import Election from './pages/Admin/election'
import ElectionDetail from './pages/Admin/electionDetail'
import Voters from './pages/Admin/voters'
import VoterDetail from './pages/Admin/voterDetail'
import Dashboard from './pages/Admin/Dashboard'
import Vote from './pages/User/Vote'

function App() {
  return <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      {/* Admin Routes */}
      <Route path="/AdminDashboard" element={<Dashboard />} />
      <Route path="/election" element={<Election />} />
      <Route path="/voters" element={<Voters />} />
      <Route path="/election/:id" element={<ElectionDetail />} />
      <Route path="/voter/:id" element={<VoterDetail />} />

      {/* user Route */}
      <Route path="/vote" element={<Vote />} />

    </Routes>
  </Router>
}

export default App
