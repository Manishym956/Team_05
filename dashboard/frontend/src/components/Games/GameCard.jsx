import { motion } from 'framer-motion';
import { Calendar, Star, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const GameCard = ({ game }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/game/${game.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer"
      onClick={handleClick}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={game.background_image || '/placeholder-game.jpg'}
          alt={game.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x225?text=No+Image';
          }}
        />
        {game.metacritic && (
          <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-sm font-bold">
            {game.metacritic}
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2 line-clamp-1">{game.name}</h3>
        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span>{game.rating?.toFixed(1) || 'N/A'}</span>
          </div>
          {game.released && (
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{new Date(game.released).getFullYear()}</span>
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {game.genres?.slice(0, 2).map((genre) => (
            <span
              key={genre.id}
              className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded text-xs"
            >
              {genre.name}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-1 mt-2">
          {game.platforms?.slice(0, 3).map((platform) => (
            <span
              key={platform.platform.id}
              className="text-xs text-gray-500 dark:text-gray-400"
            >
              {platform.platform.name}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default GameCard;

