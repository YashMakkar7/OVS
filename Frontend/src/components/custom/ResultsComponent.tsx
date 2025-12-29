import { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import useCandidateStore, { Candidate } from '../../state_galary/CandidateStore';
import { AlertCircle, BarChart3, PieChart } from 'lucide-react';
import ElectionBarChart from './ElectionBarChart';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

interface ResultsComponentProps {
  electionId: string;
}

const ResultsComponent = ({ electionId }: ResultsComponentProps) => {
  const { fetchCandidates } = useCandidateStore();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartData, setChartData] = useState<any>(null);
  const [activeChart, setActiveChart] = useState<'pie' | 'bar'>('pie');
  
  useEffect(() => {
    const loadCandidates = async () => {
      setLoading(true);
      try {
        const fetchedCandidates = await fetchCandidates(electionId);
        
        // Sort candidates by votes in descending order
        const sortedCandidates = [...fetchedCandidates].sort((a, b) => b.votes - a.votes);
        setCandidates(sortedCandidates);
        
        // Prepare chart data
        prepareChartData(sortedCandidates);
      } catch (err) {
        setError('Failed to load candidates and results');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    loadCandidates();
  }, [electionId, fetchCandidates]);
  
  const prepareChartData = (candidateData: Candidate[]) => {
    // Generate colors array
    const generateColors = (count: number) => {
      const colors = [];
      const backgroundColors = [];
      
      // Predefined colors
      const colorPalette = [
        { bg: 'rgba(54, 162, 235, 0.6)', border: 'rgb(54, 162, 235)' },
        { bg: 'rgba(255, 99, 132, 0.6)', border: 'rgb(255, 99, 132)' },
        { bg: 'rgba(255, 206, 86, 0.6)', border: 'rgb(255, 206, 86)' },
        { bg: 'rgba(75, 192, 192, 0.6)', border: 'rgb(75, 192, 192)' },
        { bg: 'rgba(153, 102, 255, 0.6)', border: 'rgb(153, 102, 255)' },
        { bg: 'rgba(255, 159, 64, 0.6)', border: 'rgb(255, 159, 64)' },
        { bg: 'rgba(45, 125, 210, 0.6)', border: 'rgb(45, 125, 210)' },
        { bg: 'rgba(240, 82, 82, 0.6)', border: 'rgb(240, 82, 82)' },
      ];
      
      for (let i = 0; i < count; i++) {
        const colorIndex = i % colorPalette.length;
        backgroundColors.push(colorPalette[colorIndex].bg);
        colors.push(colorPalette[colorIndex].border);
      }
      
      return { backgroundColors, borderColors: colors };
    };
    
    if (candidateData.length > 0) {
      const { backgroundColors, borderColors } = generateColors(candidateData.length);
      
      setChartData({
        labels: candidateData.map(c => c.name),
        datasets: [
          {
            label: 'Votes',
            data: candidateData.map(c => c.votes),
            backgroundColor: backgroundColors,
            borderColor: borderColors,
            borderWidth: 1,
          },
        ],
      });
    }
  };
  
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
        <div className="text-center py-10">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-6 w-32 bg-gray-200 rounded mb-4"></div>
            <div className="h-48 w-48 rounded-full bg-gray-200 mb-4"></div>
            <div className="h-4 w-64 bg-gray-200 rounded"></div>
          </div>
          <p className="text-lg text-gray-600 mt-4">Loading results...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 rounded-xl shadow-sm p-6 mt-6">
        <div className="flex items-center justify-center text-red-600 mb-4">
          <AlertCircle size={48} />
        </div>
        <h2 className="text-xl font-bold text-center mb-2">Error Loading Results</h2>
        <p className="text-center text-red-600">{error}</p>
      </div>
    );
  }
  
  if (candidates.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
        <div className="text-center py-10">
          <p className="text-lg text-gray-600">No candidates found for this election.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Election Results</h2>
        <p className="text-gray-600">Final vote counts for all candidates in this election.</p>
      </div>
      
      <div className="flex justify-center mb-6">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button
            type="button"
            onClick={() => setActiveChart('pie')}
            className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
              activeChart === 'pie' 
                ? 'bg-blue-700 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            } border border-gray-200 flex items-center`}
          >
            <PieChart size={16} className="mr-2" />
            Pie Chart
          </button>
          <button
            type="button"
            onClick={() => setActiveChart('bar')}
            className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
              activeChart === 'bar' 
                ? 'bg-blue-700 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            } border border-gray-200 flex items-center`}
          >
            <BarChart3 size={16} className="mr-2" />
            Bar Chart
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart Section */}
        <div className="flex flex-col items-center">
          <h3 className="text-lg font-semibold mb-4">Vote Distribution</h3>
          <div className="w-full max-w-md">
            {activeChart === 'pie' && chartData && (
              <Pie data={chartData} options={{ 
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: {
                      padding: 20,
                      boxWidth: 15
                    }
                  }
                }
              }} />
            )}
            
            {activeChart === 'bar' && candidates.length > 0 && (
              <ElectionBarChart candidates={candidates} />
            )}
          </div>
        </div>
        
        {/* Candidate Results Table */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Candidate Rankings</h3>
          <div className="overflow-hidden bg-white border border-gray-200 rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rank
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Candidate
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Votes
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {candidates.map((candidate, index) => (
                  <tr key={candidate._id} className={index === 0 ? "bg-blue-50" : ""}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {index === 0 ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Winner
                        </span>
                      ) : (
                        `#${index + 1}`
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {candidate.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="font-semibold">{candidate.votes}</span>
                      {candidates.length > 0 && candidates.reduce((sum, c) => sum + c.votes, 0) > 0 && (
                        <span className="text-xs text-gray-500 ml-2">
                          ({Math.round((candidate.votes / candidates.reduce((sum, c) => sum + c.votes, 0)) * 100)}%)
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Additional Candidate Details */}
          {candidates.length > 0 && candidates[0].description && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Winner Details</h3>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h4 className="font-medium text-lg text-blue-800">{candidates[0].name}</h4>
                <p className="text-gray-700 mt-2">{candidates[0].description}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultsComponent; 