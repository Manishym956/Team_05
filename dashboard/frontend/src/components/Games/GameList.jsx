import { useQuery, useQueryClient } from '@tanstack/react-query';
import { gamesAPI } from '../../services/api';
import GameCard from './GameCard';
import LoadingSkeleton from '../UI/LoadingSkeleton';
import { RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

const GameList = ({ searchParams = {} }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const queryClient = useQueryClient();
  
  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ['games', searchParams],
    queryFn: () => {
      if (Object.keys(searchParams).length > 0) {
        return gamesAPI.search(searchParams).then(res => res.data);
      }
      return gamesAPI.getTrending().then(res => res.data);
    },
  });

  const handleRefresh = async () => {
    if (isRefreshing || isFetching) return;
    
    setIsRefreshing(true);
    try {
      await queryClient.invalidateQueries({ queryKey: ['games', searchParams] });
      await refetch();
    } catch (err) {
      console.error('Error refreshing games:', err);
    } finally {
      setTimeout(() => {
        setIsRefreshing(false);
      }, 300);
    }
  };

  if (isLoading && !data) {
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
    <div>
      {/* Refresh button */}
      {!isLoading && (
        <div className="flex justify-end mb-4">
          <motion.button
            whileHover={{ scale: isRefreshing || isFetching ? 1 : 1.05 }}
            whileTap={{ scale: isRefreshing || isFetching ? 1 : 0.95 }}
            onClick={handleRefresh}
            disabled={isRefreshing || isFetching}
            className={`relative flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-glow transition-all duration-200 font-medium overflow-hidden ${
              isRefreshing || isFetching ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            {/* Loading overlay effect */}
            {(isRefreshing || isFetching) && (
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{
                  repeat: Infinity,
                  duration: 1.5,
                  ease: 'linear'
                }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              />
            )}
            <RefreshCw 
              className={`w-4 h-4 transition-transform duration-300 ${
                isRefreshing || isFetching ? 'animate-spin' : ''
              }`} 
            />
            <span className="relative z-10">{isRefreshing || isFetching ? 'Refreshing...' : 'Refresh'}</span>
          </motion.button>
        </div>
      )}
      
      {/* Game grid with loading overlay */}
      <div className="relative">
        {/* Loading overlay during refresh */}
        {(isRefreshing || isFetching) && data && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-10 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-xl flex items-center justify-center min-h-[400px]"
          >
            <div className="flex flex-col items-center space-y-3">
              <RefreshCw className="w-8 h-8 text-purple-600 dark:text-purple-400 animate-spin" />
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {Object.keys(searchParams).length > 0 ? 'Refreshing games...' : 'Refreshing trending games...'}
              </p>
            </div>
          </motion.div>
        )}
        
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 transition-opacity duration-300 ${
          isFetching || isRefreshing ? 'opacity-50' : 'opacity-100'
        }`}>
          {data.results.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameList;

