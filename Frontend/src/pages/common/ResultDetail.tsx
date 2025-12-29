import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import UserSidebar from "@/components/custom/UserSidebar"
import AdminSidebar from "@/components/custom/Sidebar"
import ResultsComponent from "@/components/custom/ResultsComponent"
import useElectionStore, { Election } from "@/state_galary/ElectionStore"
import { AlertCircle, ChevronLeft, Calendar, Users, Info } from "lucide-react"
import axios from "axios"

export default function ResultDetail() {
  const { id } = useParams<{ id: string }>()
  const { getElections } = useElectionStore()
  const [election, setElection] = useState<Election | null>(null)
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
    const fetchElectionDetails = async () => {
      if (!id) return

      setLoading(true)
      setError(null)

      // First try to get from the store
      const cachedElections = getElections()
      const cachedElection = cachedElections.find(e => e._id === id)
      
      if (cachedElection) {
        setElection(cachedElection)
        setLoading(false)
        return
      }

      // Otherwise fetch from API
      try {
        const response = await axios.get(`http://localhost:3000/election/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        })

        if (response.data && response.data.election) {
          setElection(response.data.election)
        } else {
          setError("Failed to fetch election details")
        }
      } catch (err) {
        console.error("Error fetching election details:", err)
        setError("Failed to load election details. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchElectionDetails()
  }, [id, getElections])

  const handleBack = () => {
    navigate('/result');
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
        <button 
          onClick={handleBack}
          className="flex items-center text-gray-600 hover:text-primaryblue mb-6 transition-colors"
        >
          <ChevronLeft size={20} className="mr-1" />
          <span>Back to Election Results</span>
        </button>

        {loading ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-6 w-32 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 w-64 bg-gray-200 rounded"></div>
            </div>
            <p className="text-lg text-gray-600 mt-4">Loading election details...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 rounded-lg shadow-md p-8">
            <div className="flex items-center mb-4">
              <AlertCircle className="text-red-500 mr-2" size={24} />
              <h2 className="text-xl font-bold text-red-700">Error</h2>
            </div>
            <p className="text-red-600">{error}</p>
            <button 
              onClick={handleBack}
              className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition"
            >
              Go Back
            </button>
          </div>
        ) : election ? (
          <>
            <div className="bg-white rounded-lg shadow-md p-8 mb-6">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
                <div>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-2 bg-blue-100 text-blue-800`}>
                    Final Results
                  </span>
                  <h1 className="text-3xl font-bold text-gray-800">{election.title}</h1>
                </div>
                <div className="flex items-center text-sm text-gray-500 mt-2 md:mt-0">
                  <Calendar size={16} className="mr-1" />
                  <span>
                    Ended on {new Date(election.createdAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
              </div>
              
              <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div className="flex items-start">
                  <Info size={20} className="text-gray-400 mr-2 mt-1" />
                  <div>
                    <h2 className="text-lg font-semibold text-gray-700 mb-2">Description</h2>
                    <p className="text-gray-600">{election.description}</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 flex items-center">
                  <div className="bg-blue-100 p-2 rounded-full mr-3">
                    <Users size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <span className="block text-sm text-gray-500">Total Votes</span>
                    <span className="block text-xl font-bold text-gray-800">{election.totalVotes}</span>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 flex items-center">
                  <div className="bg-blue-100 p-2 rounded-full mr-3">
                    <Calendar size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <span className="block text-sm text-gray-500">Created On</span>
                    <span className="block text-xl font-bold text-gray-800">
                      {new Date(election.createdAt).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 flex items-center">
                  <div className="bg-blue-100 p-2 rounded-full mr-3">
                    <AlertCircle size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <span className="block text-sm text-gray-500">Status</span>
                    <span className="block text-xl font-bold text-blue-600">
                      Completed
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {id && (
              <ResultsComponent electionId={id} />
            )}
          </>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <AlertCircle size={32} className="mx-auto text-amber-500 mb-4" />
            <p className="text-lg text-gray-600 mb-4">Election not found</p>
            <button 
              onClick={handleBack}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition"
            >
              Go back to results
            </button>
          </div>
        )}
      </div>
    </div>
  )
} 