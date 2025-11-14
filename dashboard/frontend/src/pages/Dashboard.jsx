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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-purple-900/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent">
            Gaming Analytics Dashboard
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover trending games, analyze statistics, and watch live streams in real-time
          </p>
        </motion.div>

        {/* Analytics Charts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex items-center mb-6">
            <div className="h-1 w-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mr-4" />
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Analytics Overview
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            <GenreChart />
            <PlatformChart />
            <RatingChart />
          </div>
        </motion.div>

        {/* Trending Games Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-12"
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
      </div>
    </div>
  );
};

export default Dashboard;

