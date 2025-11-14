import { useQuery } from '@tanstack/react-query';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { analyticsAPI } from '../../services/api';
import LoadingSkeleton from '../UI/LoadingSkeleton';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const PlatformChart = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['platformStats'],
    queryFn: () => analyticsAPI.getPlatformStats().then(res => res.data),
  });

  if (isLoading) {
    return <LoadingSkeleton className="h-64" />;
  }

  if (error || !data?.distribution) {
    const isApiKeyError = error?.response?.status === 503;
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
        <h3 className="text-lg font-bold mb-4">Platform Popularity</h3>
        <div className="text-center py-4">
          <p className={isApiKeyError ? "text-yellow-600 dark:text-yellow-400" : "text-red-500"}>
            {isApiKeyError 
              ? 'API key not configured' 
              : 'Error loading platform statistics'}
          </p>
        </div>
      </div>
    );
  }

  const topPlatforms = data.distribution.slice(0, 10);

  const chartData = {
    labels: topPlatforms.map(p => p.name),
    datasets: [
      {
        label: 'Number of Games',
        data: topPlatforms.map(p => p.count),
        backgroundColor: '#8B5CF6',
        borderColor: '#7C3AED',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.parsed.y} games`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#6B7280',
        },
        grid: {
          color: '#374151',
        },
      },
      x: {
        ticks: {
          color: '#6B7280',
          maxRotation: 45,
          minRotation: 45,
        },
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-soft hover:shadow-glow transition-all duration-300 border border-gray-100 dark:border-gray-700/50">
      <div className="flex items-center mb-6">
        <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full mr-3" />
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Platform Popularity</h3>
      </div>
      <div className="h-64">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default PlatformChart;

