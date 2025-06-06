import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Admin/home'
import Election from './pages/Admin/election'
import ElectionDetail from './pages/Admin/electionDetail'
import Voters from './pages/Admin/voters'
import VoterDetail from './pages/Admin/voterDetail'
import Dashboard from './pages/Admin/Dashboard'
import Vote from './pages/User/Vote'
import VoteDetail from './pages/User/VoteDetail'
import UserDashboardPlus from './pages/User/UserDashboard'
import Results from './pages/common/results'
import ResultDetail from './pages/common/ResultDetail'

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
      
      {/* Result Routes */}
      <Route path="/result" element={<Results />} />
      <Route path="/result/:id" element={<ResultDetail />} />
      
      {/* user Route */}
      <Route path="/vote" element={<Vote />} />
      <Route path="/vote/:id" element={<VoteDetail />} />
      <Route path="/dashboard/:id" element={<UserDashboardPlus />} />

    </Routes>
  </Router>
}

export default App
