import { useQuery } from '@tanstack/react-query';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { analyticsAPI } from '../../services/api';
import LoadingSkeleton from '../UI/LoadingSkeleton';

ChartJS.register(ArcElement, Tooltip, Legend);

const GenreChart = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['genreStats'],
    queryFn: () => analyticsAPI.getGenreStats().then(res => res.data),
  });

  if (isLoading) {
    return <LoadingSkeleton className="h-64" />;
  }

  if (error || !data?.distribution) {
    const isApiKeyError = error?.response?.status === 503;
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
        <h3 className="text-lg font-bold mb-4">Genre Distribution</h3>
        <div className="text-center py-4">
          <p className={isApiKeyError ? "text-yellow-600 dark:text-yellow-400" : "text-red-500"}>
            {isApiKeyError 
              ? 'API key not configured' 
              : 'Error loading genre statistics'}
          </p>
        </div>
      </div>
    );
  }

  const topGenres = data.distribution.slice(0, 8);
  const colors = [
    '#8B5CF6', '#EC4899', '#3B82F6', '#10B981',
    '#F59E0B', '#EF4444', '#06B6D4', '#6366F1'
  ];

  const chartData = {
    labels: topGenres.map(g => g.name),
    datasets: [
      {
        data: topGenres.map(g => g.count),
        backgroundColor: colors,
        borderColor: '#1F2937',
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#6B7280',
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-soft hover:shadow-glow transition-all duration-300 border border-gray-100 dark:border-gray-700/50">
      <div className="flex items-center mb-6">
        <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full mr-3" />
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Genre Distribution</h3>
      </div>
      <div className="h-64">
        <Pie data={chartData} options={options} />
      </div>
    </div>
  );
};

export default GenreChart;

