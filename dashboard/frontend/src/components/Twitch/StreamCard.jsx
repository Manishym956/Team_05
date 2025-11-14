import { motion } from 'framer-motion';
import { Users, ExternalLink, Radio } from 'lucide-react';

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
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-soft hover:shadow-glow-lg transition-all duration-300 block border border-gray-100 dark:border-gray-700/50"
    >
      <div className="relative h-40 overflow-hidden">
        <motion.img
          src={stream.thumbnail_url?.replace('{width}', '400').replace('{height}', '225')}
          alt={stream.user_name}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x225?text=Live';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-3 left-3 flex items-center space-x-2 bg-gradient-to-r from-red-600 to-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg backdrop-blur-sm"
        >
          <Radio className="w-3 h-3" />
          <span className="flex items-center space-x-1.5">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span>LIVE</span>
          </span>
        </motion.div>
        <div className="absolute bottom-3 right-3 flex items-center space-x-2 bg-black/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-xs font-semibold">
          <Users className="w-4 h-4" />
          <span>{formatViewerCount(stream.viewer_count)}</span>
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-bold text-lg mb-2 line-clamp-1 text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
          {stream.user_name}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3 min-h-[2.5rem]">
          {stream.title}
        </p>
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
          <span className="text-xs text-purple-600 dark:text-purple-400 font-bold px-3 py-1 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
            {stream.game_name}
          </span>
          <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" />
        </div>
      </div>
    </motion.a>
  );
};

export default StreamCard;

