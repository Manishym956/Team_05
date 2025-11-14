import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search as SearchIcon } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { gamesAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const SearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['search', query],
    queryFn: () => gamesAPI.search({ q: query, page_size: 10 }).then(res => res.data),
    enabled: query.length > 2,
  });

  const handleGameClick = (gameId) => {
    navigate(`/game/${gameId}`);
    onClose();
    setQuery('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 w-full max-w-2xl z-50"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-glow-lg mx-4 border border-gray-100 dark:border-gray-700/50 overflow-hidden">
              <div className="flex items-center border-b border-gray-200 dark:border-gray-700 p-5 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-800">
                <div className="flex items-center flex-1 bg-white dark:bg-gray-700 rounded-xl px-4 py-3 shadow-sm">
                  <SearchIcon className="w-5 h-5 text-purple-600 dark:text-purple-400 mr-3" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search games by name, genre, or platform..."
                    className="flex-1 bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                    autoFocus
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="ml-3 p-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </motion.button>
              </div>
              {query.length > 2 && (
                <div className="max-h-96 overflow-y-auto">
                  {isLoading ? (
                    <div className="p-8 text-center">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                      <p className="mt-4 text-gray-500 dark:text-gray-400">Searching games...</p>
                    </div>
                  ) : data?.results?.length > 0 ? (
                    <div className="divide-y divide-gray-100 dark:divide-gray-700">
                      {data.results.map((game, idx) => (
                        <motion.button
                          key={game.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          whileHover={{ x: 4 }}
                          onClick={() => handleGameClick(game.id)}
                          className="w-full p-4 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 dark:hover:from-gray-700 dark:hover:to-gray-700 transition-all text-left flex items-center space-x-4 group"
                        >
                          <motion.img
                            src={game.background_image || '/placeholder-game.jpg'}
                            alt={game.name}
                            className="w-20 h-20 object-cover rounded-xl shadow-md group-hover:shadow-lg transition-shadow"
                            whileHover={{ scale: 1.05 }}
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/80x80?text=No+Image';
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors truncate">
                              {game.name}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                              {game.genres?.map(g => g.name).join(', ') || 'No genre'}
                            </p>
                          </div>
                          {game.rating && (
                            <div className="flex items-center space-x-1 bg-amber-50 dark:bg-amber-900/20 px-3 py-1.5 rounded-lg">
                              <span className="text-sm font-bold text-amber-600 dark:text-amber-400">
                                {game.rating.toFixed(1)}
                              </span>
                              <span className="text-amber-500">⭐</span>
                            </div>
                          )}
                        </motion.button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <p className="text-gray-500 dark:text-gray-400">No games found matching "{query}"</p>
                    </div>
                  )}
                </div>
              )}
              {query.length <= 2 && query.length > 0 && (
                <div className="p-4 text-center text-sm text-gray-400">
                  Type at least 3 characters to search
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SearchModal;

