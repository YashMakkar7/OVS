import Sidebar from "../../components/custom/Sidebar";
import ElectionsList from "../../components/custom/ElectionsList";
import CreateElectionButton from "../../components/custom/CreateElectionButton";
import CreateElectionModal from "../../components/custom/CreateElectionModal";

export default function Election() {
    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1 overflow-auto p-8">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-charcol mb-2">Elections</h1>
                    <p className="text-gray-600">View and manage all elections</p>
                </div>
                
                <ElectionsList />
                <CreateElectionButton />
                <CreateElectionModal />
            </div>
        </div>
    );
}