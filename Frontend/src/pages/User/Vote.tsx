import Sidebar from "@/components/custom/UserSidebar"
import useElectionStore, { Election } from "@/state_galary/ElectionStore"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

export default function Vote() {
  const { setElections } = useElectionStore()
  const [activeElections, setActiveElections] = useState<Election[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchElections = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await axios.get('http://localhost:3000/election', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }
        })

        if (response.data.success && response.data.elections) {
          // Store all elections in the global store
          setElections(response.data.elections)

          // Filter active elections for the current view
          const active = response.data.elections.filter(
            (election: Election) => election.status === 'active'
          )
          setActiveElections(active)
        } else {
          setError('Failed to fetch elections')
        }
      } catch (err) {
        console.error("Error fetching elections:", err)
        setError('Failed to load elections. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchElections()
  }, [setElections])

  const handleElectionClick = (id: string) => {
    navigate(`/vote/${id}`)
  }

  return <div className="flex h-screen bg-gray-50">
    <Sidebar />
    <div className="flex-1 p-8 overflow-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Ongoing Elections</h1>

      {loading ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-lg text-gray-600">Loading elections...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 rounded-lg shadow-md p-6 text-center">
          <p className="text-lg text-red-600">{error}</p>
        </div>
      ) : activeElections.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-lg text-gray-600">No active elections available at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeElections.map(election => (
            <div

              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex justify-between items-start mb-3">
                <h2
                  key={election._id}
                  onClick={() => handleElectionClick(election._id)}
                  className="text-xl font-bold text-gray-800 hover:text-primaryblue cursor-pointer hover:underline">{election.title}</h2>
                <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  <svg className="w-4 h-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  active
                </span>
              </div>
              <p className="text-gray-600 mb-4 border-l-4 border-gray-200 pl-3">{election.description}</p>
              <div className="flex flex-col space-y-2 text-sm text-gray-500">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>{election.totalVotes} votes recorded</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Created on {new Date(election.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleElectionClick(election._id);
                  }}
                  className="text-blue-600 hover:text-primaryblue text-sm "
                >
                  View details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
}