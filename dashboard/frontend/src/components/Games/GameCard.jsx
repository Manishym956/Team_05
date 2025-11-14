import { motion } from 'framer-motion';
import { Calendar, Star, TrendingUp } from 'lucide-react';
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
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-soft hover:shadow-glow-lg transition-all duration-300 cursor-pointer border border-gray-100 dark:border-gray-700/50"
      onClick={handleClick}
    >
      <div className="relative h-56 overflow-hidden">
        <motion.img
          src={game.background_image || '/placeholder-game.jpg'}
          alt={game.name}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x225?text=No+Image';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {game.metacritic && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-3 right-3 bg-gradient-to-br from-green-500 to-emerald-600 text-white px-3 py-1.5 rounded-lg text-sm font-bold shadow-lg backdrop-blur-sm"
          >
            {game.metacritic}
          </motion.div>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <div className="flex items-center space-x-2 text-white text-sm">
            <TrendingUp className="w-4 h-4" />
            <span className="font-medium">View Details</span>
          </div>
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-bold text-lg mb-3 line-clamp-1 text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
          {game.name}
        </h3>
        <div className="flex items-center space-x-4 text-sm mb-3">
          <div className="flex items-center space-x-1.5 bg-amber-50 dark:bg-amber-900/20 px-2.5 py-1 rounded-lg">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="font-semibold text-gray-900 dark:text-white">{game.rating?.toFixed(1) || 'N/A'}</span>
          </div>
          {game.released && (
            <div className="flex items-center space-x-1.5 text-gray-600 dark:text-gray-400">
              <Calendar className="w-4 h-4" />
              <span>{new Date(game.released).getFullYear()}</span>
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-2 mb-3">
          {game.genres?.slice(0, 2).map((genre) => (
            <span
              key={genre.id}
              className="px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-700 dark:text-purple-300 rounded-lg text-xs font-medium border border-purple-200 dark:border-purple-800"
            >
              {genre.name}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {game.platforms?.slice(0, 3).map((platform, idx) => (
            <span
              key={platform.platform.id}
              className="text-xs text-gray-500 dark:text-gray-400 font-medium px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded"
            >
              {platform.platform.name}
              {idx < Math.min(game.platforms.length, 3) - 1 && ','}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default GameCard;

