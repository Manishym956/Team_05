import { useQuery, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { twitchAPI } from '../../services/api';
import StreamCard from './StreamCard';
import LoadingSkeleton from '../UI/LoadingSkeleton';
import { RefreshCw } from 'lucide-react';
import { useState } from 'react';

const StreamList = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const queryClient = useQueryClient();
  
  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ['twitchStreams'],
    queryFn: () => twitchAPI.getTopStreams().then(res => res.data),
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 0, // Always consider data stale to allow manual refresh
  });

  const handleRefresh = async () => {
    if (isRefreshing || isFetching) return; // Prevent multiple simultaneous refreshes
    
    setIsRefreshing(true);
    try {
      // Invalidate the query cache to force a fresh fetch
      await queryClient.invalidateQueries({ queryKey: ['twitchStreams'] });
      // Then refetch
      await refetch();
    } catch (err) {
      console.error('Error refreshing streams:', err);
    } finally {
      // Keep loading state until refetch completes (handled by isFetching)
      // Small delay to ensure smooth transition
      setTimeout(() => {
        setIsRefreshing(false);
      }, 300);
    }
  };

  if (isLoading && !data) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-1 h-8 bg-gradient-to-b from-red-500 to-pink-500 rounded-full" />
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Live Streams</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <LoadingSkeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">Error loading streams: {error.message}</p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!data?.data || data.data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">No live streams available</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-1 h-8 bg-gradient-to-b from-red-500 to-pink-500 rounded-full" />
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Live Streams</h2>
        </div>
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
      <div className="relative">
        {/* Loading overlay during refresh */}
        {(isRefreshing || isFetching) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-10 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-xl flex items-center justify-center"
          >
            <div className="flex flex-col items-center space-y-3">
              <RefreshCw className="w-8 h-8 text-purple-600 dark:text-purple-400 animate-spin" />
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Refreshing streams...</p>
            </div>
          </motion.div>
        )}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 transition-opacity duration-300 ${
          isFetching || isRefreshing ? 'opacity-50' : 'opacity-100'
        }`}>
          {data.data.map((stream) => (
            <StreamCard key={stream.id} stream={stream} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default StreamList;

