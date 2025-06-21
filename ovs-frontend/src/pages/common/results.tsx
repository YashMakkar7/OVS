import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import UserSidebar from "@/components/custom/UserSidebar"
import AdminSidebar from "@/components/custom/Sidebar"
import useElectionStore, { Election } from "@/state_galary/ElectionStore"
import axios from "axios"
import { AlignJustify, Calendar, ChevronRight, Users} from "lucide-react"

export default function Results() {
  const { setElections } = useElectionStore()
  const [completedElections, setCompletedElections] = useState<Election[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userRole, setUserRole] = useState<'admin' | 'user' | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    // Determine user role based on token
    const checkUserRole = async () => {
      try {
        // Try fetching admin info
        const adminResponse = await axios.get('http://localhost:3000/info/admin', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (adminResponse.status === 200) {
          setUserRole('admin');
          return;
        }
      } catch (err) {
        // If admin check fails, try user
        try {
          const userResponse = await axios.get('http://localhost:3000/info/user', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
          
          if (userResponse.status === 200) {
            setUserRole('user');
            return;
          }
        } catch (err) {
          // If both fail, redirect to home
          navigate('/');
        }
      }
    }
    
    checkUserRole();
  }, [navigate]);

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

          // Filter completed elections for the current view
          const completed = response.data.elections.filter(
            (election: Election) => election.status === 'completed'
          )
          setCompletedElections(completed)
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
    navigate(`/result/${id}`)
  }

  // Render nothing while determining user role
  if (userRole === null) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {userRole === 'admin' ? <AdminSidebar /> : <UserSidebar />}
      <div className="flex-1 p-8 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Election Results</h1>
        </div>

        {loading ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-6 w-32 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 w-64 bg-gray-200 rounded"></div>
            </div>
            <p className="text-lg text-gray-600 mt-4">Loading election results...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 rounded-lg shadow-md p-6 text-center">
            <p className="text-lg text-red-600">{error}</p>
          </div>
        ) : completedElections.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-lg text-gray-600">No completed elections available.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedElections.map(election => (
                <div 
                  key={election._id}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                  onClick={() => handleElectionClick(election._id)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h2 className="text-xl font-bold text-gray-800 hover:text-primaryblue">{election.title}</h2>
                    <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      <AlignJustify size={16} className="mr-1" />
                      results
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4 border-l-4 border-gray-200 pl-3">{election.description}</p>
                  <div className="flex flex-col space-y-2 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Users size={16} className="mr-2 text-gray-400" />
                      <span>{election.totalVotes} votes recorded</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar size={16} className="mr-2 text-gray-400" />
                      <span>Ended on {new Date(election.createdAt).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleElectionClick(election._id);
                      }}
                      className="text-blue-600 hover:text-primaryblue text-sm flex items-center"
                    >
                      View results <ChevronRight size={16} className="ml-1" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}