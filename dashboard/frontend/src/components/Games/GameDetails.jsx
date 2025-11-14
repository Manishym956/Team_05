import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { gamesAPI } from '../../services/api';
import { X, Star, Calendar, ExternalLink } from 'lucide-react';
import LoadingSkeleton from '../UI/LoadingSkeleton';
import { motion, AnimatePresence } from 'framer-motion';

const GameDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: game, isLoading, error } = useQuery({
    queryKey: ['game', id],
    queryFn: () => gamesAPI.getById(id).then(res => res.data),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <LoadingSkeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md">
          <p className="text-red-500 mb-4">Error loading game details</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen bg-gray-50 dark:bg-gray-900"
      >
        <div className="container mx-auto py-8 px-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full mx-auto overflow-hidden shadow-xl"
        >
          <div className="relative">
            <div className="h-64 md:h-96 relative overflow-hidden">
              <img
                src={game.background_image || game.background_image_additional}
                alt={game.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/1200x675?text=No+Image';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
              <button
                onClick={() => navigate(-1)}
                className="absolute top-4 right-4 p-2 bg-black bg-opacity-50 rounded-full hover:bg-opacity-70 transition-colors z-10"
              >
                <X className="w-6 h-6 text-white" />
              </button>
              <div className="absolute bottom-4 left-4 right-4">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{game.name}</h1>
                <div className="flex items-center space-x-4 text-white">
                  {game.rating && (
                    <div className="flex items-center space-x-1">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{game.rating.toFixed(1)}</span>
                    </div>
                  )}
                  {game.metacritic && (
                    <div className="px-3 py-1 bg-green-500 rounded font-bold">
                      {game.metacritic}
                    </div>
                  )}
                  {game.released && (
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-5 h-5" />
                      <span>{new Date(game.released).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-2">Description</h2>
                <p
                  className="text-gray-700 dark:text-gray-300 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: game.description || 'No description available.' }}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-semibold mb-2">Genres</h3>
                  <div className="flex flex-wrap gap-2">
                    {game.genres?.map((genre) => (
                      <span
                        key={genre.id}
                        className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Platforms</h3>
                  <div className="flex flex-wrap gap-2">
                    {game.platforms?.map((platform) => (
                      <span
                        key={platform.platform.id}
                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded"
                      >
                        {platform.platform.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {game.website && (
                <a
                  href={game.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <span>Visit Website</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}

              {game.screenshots && game.screenshots.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold mb-4">Screenshots</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {game.screenshots.slice(0, 6).map((screenshot) => (
                      <img
                        key={screenshot.id}
                        src={screenshot.image}
                        alt={`${game.name} screenshot`}
                        className="rounded-lg w-full h-32 object-cover"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default GameDetails;

