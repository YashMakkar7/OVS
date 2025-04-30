import { useParams } from "react-router-dom"
import Sidebar from "@/components/custom/UserSidebar"

export default function VoteDetail() {
  const { id } = useParams<{ id: string }>()

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-8 overflow-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Election Details</h1>
          <div className="p-6 bg-gray-100 rounded-lg border border-gray-200">
            <p className="text-xl font-medium">Election ID: <span className="font-bold text-blue-600">{id}</span></p>
            <p className="mt-4 text-gray-600">This is a placeholder page showing just the election ID as requested.</p>
          </div>
        </div>
      </div>
    </div>
  )
} 