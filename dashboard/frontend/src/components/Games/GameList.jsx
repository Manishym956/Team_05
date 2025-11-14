import { useQuery } from '@tanstack/react-query';
import { gamesAPI } from '../../services/api';
import GameCard from './GameCard';
import LoadingSkeleton from '../UI/LoadingSkeleton';

const GameList = ({ searchParams = {} }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['games', searchParams],
    queryFn: () => {
      if (Object.keys(searchParams).length > 0) {
        return gamesAPI.search(searchParams).then(res => res.data);
      }
      return gamesAPI.getTrending().then(res => res.data);
    },
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <LoadingSkeleton key={i} className="h-80" />
        ))}
      </div>
    );
  }

  if (error) {
    const isApiKeyError = error?.response?.status === 503 || error?.response?.data?.error === 'RAWG API key not configured';
    return (
      <div className="text-center py-12">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 max-w-md mx-auto">
          <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
            {isApiKeyError ? 'API Key Required' : 'Error Loading Games'}
          </h3>
          <p className="text-yellow-700 dark:text-yellow-300 mb-4">
            {isApiKeyError 
              ? 'Please configure your RAWG API key in the backend .env file. Get one at https://rawg.io/apidocs'
              : error.message || 'Failed to load games. Please try again later.'}
          </p>
          {isApiKeyError && (
            <a 
              href="https://rawg.io/apidocs" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
            >
              Get API Key
            </a>
          )}
        </div>
      </div>
    );
  }

  if (!data?.results || data.results.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">No games found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {data.results.map((game) => (
        <GameCard key={game.id} game={game} />
      ))}
    </div>
  );
};

export default GameList;

