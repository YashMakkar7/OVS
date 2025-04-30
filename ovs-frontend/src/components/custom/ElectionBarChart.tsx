import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Candidate } from '../../state_galary/CandidateStore';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ElectionBarChartProps {
  candidates: Candidate[];
}

const ElectionBarChart = ({ candidates }: ElectionBarChartProps) => {
  // Sort candidates by votes in descending order
  const sortedCandidates = [...candidates].sort((a, b) => b.votes - a.votes);
  
  // Generate colors array
  const generateColors = (count: number) => {
    const backgroundColors = [];
    const borderColors = [];
    
    // Predefined colors
    const colorPalette = [
      { bg: 'rgba(54, 162, 235, 0.6)', border: 'rgb(54, 162, 235)' },
      { bg: 'rgba(255, 99, 132, 0.6)', border: 'rgb(255, 99, 132)' },
      { bg: 'rgba(255, 206, 86, 0.6)', border: 'rgb(255, 206, 86)' },
      { bg: 'rgba(75, 192, 192, 0.6)', border: 'rgb(75, 192, 192)' },
      { bg: 'rgba(153, 102, 255, 0.6)', border: 'rgb(153, 102, 255)' },
      { bg: 'rgba(255, 159, 64, 0.6)', border: 'rgb(255, 159, 64)' },
    ];
    
    for (let i = 0; i < count; i++) {
      const colorIndex = i % colorPalette.length;
      backgroundColors.push(colorPalette[colorIndex].bg);
      borderColors.push(colorPalette[colorIndex].border);
    }
    
    return { backgroundColors, borderColors };
  };
  
  const { backgroundColors, borderColors } = generateColors(sortedCandidates.length);
  
  const chartData = {
    labels: sortedCandidates.map(c => c.name),
    datasets: [
      {
        label: 'Votes',
        data: sortedCandidates.map(c => c.votes),
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        borderWidth: 1,
      },
    ],
  };
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        display: false,
      },
      title: {
        display: true,
        text: 'Vote Distribution by Candidate',
        font: {
          size: 16,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Votes',
        },
        ticks: {
          precision: 0,
        },
      },
      x: {
        title: {
          display: true,
          text: 'Candidates',
        },
      },
    },
  };
  
  return (
    <div className="w-full h-80">
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};

export default ElectionBarChart; 