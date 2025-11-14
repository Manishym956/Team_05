import { useQuery } from '@tanstack/react-query';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { gamesAPI } from '../../services/api';
import LoadingSkeleton from '../UI/LoadingSkeleton';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const RatingChart = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['ratingTrends'],
    queryFn: () => gamesAPI.getTrending().then(res => res.data),
  });

  if (isLoading) {
    return <LoadingSkeleton className="h-64" />;
  }

  if (error || !data?.results) {
    const isApiKeyError = error?.response?.status === 503;
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
        <h3 className="text-lg font-bold mb-4">Rating Trends</h3>
        <div className="text-center py-4">
          <p className={isApiKeyError ? "text-yellow-600 dark:text-yellow-400" : "text-red-500"}>
            {isApiKeyError 
              ? 'API key not configured' 
              : 'Error loading rating data'}
          </p>
        </div>
      </div>
    );
  }

  // Group games by release year and calculate average rating
  const gamesByYear = {};
  data.results.forEach(game => {
    if (game.released && game.rating) {
      const year = new Date(game.released).getFullYear();
      if (!gamesByYear[year]) {
        gamesByYear[year] = { total: 0, count: 0 };
      }
      gamesByYear[year].total += game.rating;
      gamesByYear[year].count += 1;
    }
  });

  const years = Object.keys(gamesByYear).sort();
  const avgRatings = years.map(year => 
    (gamesByYear[year].total / gamesByYear[year].count).toFixed(2)
  );

  const chartData = {
    labels: years,
    datasets: [
      {
        label: 'Average Rating',
        data: avgRatings,
        borderColor: '#EC4899',
        backgroundColor: 'rgba(236, 72, 153, 0.1)',
        tension: 0.4,
        fill: true,
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
          label: (context) => `Rating: ${context.parsed.y}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        min: 0,
        max: 5,
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
        },
        grid: {
          color: '#374151',
        },
      },
    },
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-soft hover:shadow-glow transition-all duration-300 border border-gray-100 dark:border-gray-700/50">
      <div className="flex items-center mb-6">
        <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full mr-3" />
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Rating Trends</h3>
      </div>
      <div className="h-64">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default RatingChart;

