import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { twitchAPI } from '../../services/api';
import StreamCard from './StreamCard';
import LoadingSkeleton from '../UI/LoadingSkeleton';
import { RefreshCw } from 'lucide-react';
import { useEffect } from 'react';

const StreamList = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['twitchStreams'],
    queryFn: () => twitchAPI.getTopStreams().then(res => res.data),
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 30000);

    return () => clearInterval(interval);
  }, [refetch]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <LoadingSkeleton key={i} className="h-64" />
        ))}
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
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => refetch()}
          className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-glow transition-all duration-200 font-medium"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh</span>
        </motion.button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {data.data.map((stream) => (
          <StreamCard key={stream.id} stream={stream} />
        ))}
      </div>
    </div>
  );
};

export default StreamList;

