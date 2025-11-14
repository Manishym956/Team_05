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
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 w-full max-w-2xl z-50"
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl mx-4">
              <div className="flex items-center border-b border-gray-200 dark:border-gray-700 p-4">
                <SearchIcon className="w-5 h-5 text-gray-400 mr-3" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search games..."
                  className="flex-1 bg-transparent outline-none text-gray-900 dark:text-gray-100"
                  autoFocus
                />
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {query.length > 2 && (
                <div className="max-h-96 overflow-y-auto">
                  {isLoading ? (
                    <div className="p-4 text-center text-gray-500">Searching...</div>
                  ) : data?.results?.length > 0 ? (
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                      {data.results.map((game) => (
                        <button
                          key={game.id}
                          onClick={() => handleGameClick(game.id)}
                          className="w-full p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left flex items-center space-x-4"
                        >
                          <img
                            src={game.background_image || '/placeholder-game.jpg'}
                            alt={game.name}
                            className="w-16 h-16 object-cover rounded"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/64x64?text=No+Image';
                            }}
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                              {game.name}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {game.genres?.map(g => g.name).join(', ')}
                            </p>
                          </div>
                          {game.rating && (
                            <div className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                              {game.rating.toFixed(1)} ⭐
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-gray-500">No results found</div>
                  )}
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

