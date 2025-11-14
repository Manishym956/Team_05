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
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Error loading games: {error.message}</p>
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

