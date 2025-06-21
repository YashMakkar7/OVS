import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import Sidebar from "../../components/custom/Sidebar";
import StatsCards from "../../components/custom/StatsCards";
import ElectionChart from "../../components/custom/ElectionChart";
import UpcomingElectionsList from "../../components/custom/UpcomingElectionsList";
import ActiveElectionsCard from "../../components/custom/ActiveElectionsCard";

//store imports
import useDashboardStore from "../../state_galary/dashboardStore";
import useElectionStore from "../../state_galary/ElectionStore";
import useUsersStore from "../../state_galary/UsersStore";

// skeleton loaders
import StatsCardSkeleton from "../../components/custom/StatsCardSkeleton";
import ElectionChartSkeleton from "../../components/custom/ElectionChartSkeleton";
import UpcomingElectionsListSkeleton from "../../components/custom/UpcomingElectionsListSkeleton";
import ActiveElectionsCardSkeleton from "../../components/custom/ActiveElectionsCardSkeleton";

interface Election {
  _id: string;
  creator: string;
  title: string;
  description: string;
  totalVotes: number;
  status: 'active' | 'upcoming' | 'completed';
  createdAt: string;
  __v: number;
}

export default function Dashboard() {
  const { totalElections, activeElections, totalVoters, votesCast, upcomingElections, completedElections, setAllData } = useDashboardStore();
  const { setElections, getElections } = useElectionStore();
  const { setUsers, getCount } = useUsersStore();
  const [loading, setLoading] = useState(false); // Start as false to use cached data immediately
  const [refreshing, setRefreshing] = useState(false); // For background refresh
  const [error, setError] = useState<string | null>(null);
  //@ts-ignore
  const [initialRenderComplete, setInitialRenderComplete] = useState(false);

  // Function to fetch fresh data from API
  const fetchDashboardData = async () => {
    try {
      setRefreshing(true);
      const arrElections = await axios.get('http://localhost:3000/election');
      const arrUsers = await axios.get('http://localhost:3000/info/users',{
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      setElections(arrElections.data.elections);
      setUsers(arrUsers.data.users);
      
      // Calculate dashboard stats
      updateDashboardMetrics();
      
      setError(null);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError("Failed to refresh dashboard data.");
    } finally {
      setRefreshing(false);
      setInitialRenderComplete(true);
    }
  };

  // Calculate dashboard metrics from the current election and user data
  const updateDashboardMetrics = () => {
    const elections = getElections();
    const totalVotersCount = getCount();
    const totalElectionsCount = elections.length;
    const activeElectionsCount = elections.filter((election: Election) => election.status === 'active').length;
    const votesCastCount = elections.reduce((sum: number, election: Election) => sum + election.totalVotes, 0);
    const upcomingElectionsCount = elections.filter((election: Election) => election.status === 'upcoming').length;
    const completedElectionsCount = elections.filter((election: Election) => election.status === 'completed').length;

    setAllData(
      totalElectionsCount, 
      activeElectionsCount, 
      totalVotersCount, 
      votesCastCount, 
      upcomingElectionsCount, 
      completedElectionsCount
    );
  };

  // Initial load effect - use cached data if available, fetch new data in background
  useEffect(() => {
    // Use persisted data immediately if available
    if (getElections().length > 0) {
      // Update metrics immediately from cached data to prevent UI flicker
      updateDashboardMetrics();
      setInitialRenderComplete(true);
      // Then refresh in background
      fetchDashboardData();
    } else if (totalElections === 0) {
      // No cached data, show loading state and fetch data
      setLoading(true);
      fetchDashboardData().finally(() => setLoading(false));
    } else {
      // We have dashboard metrics but no elections (unlikely case)
      setInitialRenderComplete(true);
      fetchDashboardData();
    }
  }, []);

  // Memoize chart data to prevent unnecessary recalculations
  const electionChartData = useMemo(() => ({
    active: activeElections,
    upcoming: upcomingElections,
    completed: completedElections,
  }), [activeElections, upcomingElections, completedElections]);

  // Memoize stats data to prevent unnecessary recompositions
  const statsData = useMemo(() => ({
    totalElections,
    activeElections,
    totalVoters,
    votesCast,
    upcomingElections,
    completedElections
  }), [totalElections, activeElections, totalVoters, votesCast, upcomingElections, completedElections]);

  if (error && loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 overflow-auto p-8 flex flex-col items-center justify-center">
          <div className="text-red-500 mb-4">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            {refreshing && <span className="text-sm text-gray-500">Refreshing...</span>}
          </div>

          {loading ? <StatsCardSkeleton /> : <StatsCards data={statsData} />}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2">
              {loading ? (
                <ElectionChartSkeleton />
              ) : (
                <ElectionChart
                  title="Election Statistics"
                  data={electionChartData}
                />
              )}
            </div>
            <div>
              {loading ? (
                <ActiveElectionsCardSkeleton />
              ) : (
                <ActiveElectionsCard
                  elections={getElections()}
                />
              )}
            </div>
          </div>

          <div className="mb-6">
            {loading ? <UpcomingElectionsListSkeleton /> : <UpcomingElectionsList />}
          </div>
        </div>
      </div>
    </div>
  );
}