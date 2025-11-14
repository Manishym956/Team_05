import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { metadataAPI } from '../services/api';
import GameList from '../components/Games/GameList';
import GameFilters from '../components/Filters/GameFilters';
import GenreChart from '../components/Charts/GenreChart';
import PlatformChart from '../components/Charts/PlatformChart';
import RatingChart from '../components/Charts/RatingChart';
import StreamList from '../components/Twitch/StreamList';
import dragonLogo from '../assets/dragon-logo.png';

const Dashboard = () => {
  const [searchParams, setSearchParams] = useState({});

  const { data: genresData } = useQuery({
    queryKey: ['genres'],
    queryFn: () => metadataAPI.getGenres().then(res => res.data),
  });

  const { data: platformsData } = useQuery({
    queryKey: ['platforms'],
    queryFn: () => metadataAPI.getPlatforms().then(res => res.data),
  });

  const handleFilterChange = (filters) => {
    const params = {};
    if (filters.genre) params.genres = filters.genre;
    if (filters.platform) params.platforms = filters.platform;
    if (filters.rating) params.rating = filters.rating;
    if (filters.year) params.dates = `${filters.year}-01-01,${filters.year}-12-31`;
    setSearchParams(params);
  };

  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-br from-white via-purple-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 transition-colors duration-500 px-2 sm:px-6 py-6">
      {/* Logo and Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10 flex flex-col items-center"
      >
        <div className="flex items-center mb-4">
          <img
            src={dragonLogo}
            alt="GhostMetrics Logo"
            className="w-14 h-14 mr-3 rounded-xl shadow-lg"
          />
          <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent">
            GhostMetrics
          </h1>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl text-center">
          Discover trending games, analyze statistics, and watch live streams in real-time
        </p>
      </motion.div>

      {/* Analytics Charts - Make this section much larger and more prominent */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-24" // Increased margin-bottom for more space before Trending Games
      >
        <div className="flex items-center mb-10">
          <div className="h-2 w-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mr-6" />
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white drop-shadow-lg tracking-wide">
            Analytics Overview
          </h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-14 p-6 rounded-3xl bg-white/80 dark:bg-gray-900/80 shadow-2xl backdrop-blur-md">
          <GenreChart />
          <PlatformChart />
          <RatingChart />
        </div>
      </motion.div>

      {/* Trending Games Section - Move further down */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mb-12 mt-24" // Add top margin to push it further down
      >
        <div className="flex items-center mb-6">
          <div className="h-1 w-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mr-4" />
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Trending Games
          </h2>
        </div>
        <GameFilters
          onFilterChange={handleFilterChange}
          genres={genresData?.results || []}
          platforms={platformsData?.results || []}
        />
        <GameList searchParams={searchParams} />
      </motion.div>

      {/* Twitch Streams Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mb-12"
      >
        <div className="flex items-center mb-6">
          <div className="h-1 w-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mr-4" />
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Live Streams
          </h2>
        </div>
        <StreamList />
      </motion.div>
    </main>
  );
};

export default Dashboard;