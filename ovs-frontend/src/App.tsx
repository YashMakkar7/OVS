import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/home'
import Dashboard from './pages/dashboard'
import Election from './pages/election'
import ElectionDetail from './pages/electionDetail'
import Voters from './pages/voters'
import VoterDetail from './pages/voterDetail'

function App() {
  return <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/election" element={<Election />} />
      <Route path="/voters" element={<Voters />} />
      <Route path="/election/:id" element={<ElectionDetail />} />
      <Route path="/voter/:id" element={<VoterDetail />} />
    </Routes>
  </Router>
}

export default App
