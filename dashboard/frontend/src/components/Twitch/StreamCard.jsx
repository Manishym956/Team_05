import { motion } from 'framer-motion';
import { Users, ExternalLink } from 'lucide-react';

const StreamCard = ({ stream }) => {
  const formatViewerCount = (count) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  return (
    <motion.a
      href={`https://www.twitch.tv/${stream.user_name}`}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow block"
    >
      <div className="relative h-32 overflow-hidden">
        <img
          src={stream.thumbnail_url?.replace('{width}', '400').replace('{height}', '225')}
          alt={stream.user_name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x225?text=Live';
          }}
        />
        <div className="absolute top-2 left-2 flex items-center space-x-1 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
          <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
          <span>LIVE</span>
        </div>
        <div className="absolute bottom-2 right-2 flex items-center space-x-1 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
          <Users className="w-3 h-3" />
          <span>{formatViewerCount(stream.viewer_count)}</span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg mb-1 line-clamp-1">{stream.user_name}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1 mb-2">
          {stream.title}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-purple-600 dark:text-purple-400 font-semibold">
            {stream.game_name}
          </span>
          <ExternalLink className="w-4 h-4 text-gray-400" />
        </div>
      </div>
    </motion.a>
  );
};

export default StreamCard;

