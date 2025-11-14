import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { metadataAPI } from '../services/api';
import GameList from '../components/Games/GameList';
import GameFilters from '../components/Filters/GameFilters';
import GenreChart from '../components/Charts/GenreChart';
import PlatformChart from '../components/Charts/PlatformChart';
import RatingChart from '../components/Charts/RatingChart';
import StreamList from '../components/Twitch/StreamList';
import AnimatedBackground from '../components/UI/AnimatedBackground';
import dragonLogo from '../assets/dragon-logo.png';

const Dashboard = () => {
  const [searchParams, setSearchParams] = useState({});
  const { theme } = useTheme();
  const { scrollY } = useScroll();
  
  // Parallax effect for background
  const backgroundY = useTransform(scrollY, [0, 500], [0, 150]);

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
    
    // Only add non-empty filter values
    if (filters.genre && filters.genre.trim() !== '') {
      params.genres = filters.genre;
    }
    if (filters.platform && filters.platform.trim() !== '') {
      params.platforms = filters.platform;
    }
    if (filters.rating && filters.rating.trim() !== '') {
      params.rating = filters.rating;
    }
    
    // Handle year filter with proper validation
    if (filters.year && filters.year.trim() !== '') {
      const year = parseInt(filters.year.trim(), 10);
      const currentYear = new Date().getFullYear();
      
      // Validate: must be a valid 4-digit number within valid range
      if (!isNaN(year) && 
          filters.year.trim().length === 4 && 
          year >= 1970 && 
          year <= currentYear + 1) {
        // Format: YYYY-MM-DD,YYYY-MM-DD (start date, end date)
        params.dates = `${year}-01-01,${year}-12-31`;
      }
    }
    
    setSearchParams(params);
  };

  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 transition-colors duration-500 px-2 sm:px-6 py-6 relative overflow-hidden">
      {/* Animated Background */}
      <AnimatedBackground intensity="medium" speed="normal" />
      
      {/* Content */}
      <div className="relative z-10">
      {/* Logo and Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10 flex flex-col items-center"
      >
        <motion.div 
          className="flex items-center mb-4"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <motion.img
            src={dragonLogo}
            alt="GhostMetrics Logo"
            className="w-14 h-14 mr-3 rounded-xl shadow-lg relative z-10"
            animate={{
              rotate: [0, 5, -5, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
          />
          <motion.h1 
            className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 dark:from-slate-200 dark:via-slate-300 dark:to-slate-200 bg-clip-text text-transparent relative"
            animate={{
              backgroundPosition: ["0%", "100%", "0%"]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              backgroundSize: "200% auto"
            }}
          >
            GhostMetrics
            {/* Animated glow effect */}
            <motion.span
              className={`absolute inset-0 blur-xl opacity-30 ${
                theme === 'dark' 
                  ? 'bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400' 
                  : 'bg-gradient-to-r from-purple-300 via-pink-300 to-indigo-300'
              }`}
              animate={{
                opacity: [0.2, 0.4, 0.2],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}
            />
          </motion.h1>
        </motion.div>
        <motion.p 
          className="text-lg italic font-medium max-w-2xl text-center bg-gradient-to-r from-slate-600 via-slate-500 to-slate-600 dark:from-slate-300 dark:via-slate-400 dark:to-slate-300 bg-clip-text text-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Discover trending games, analyze statistics, and watch live streams in real-time
        </motion.p>
      </motion.div>

      {/* Analytics Charts - Make this section much larger and more prominent */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-24"
        whileHover={{ scale: 1.01 }}
      >
        <div className="flex items-center mb-10">
          <motion.div 
            className="h-2 rounded-full mr-6 relative overflow-hidden"
            initial={{ width: 0 }}
            animate={{ width: 80 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-slate-600 via-slate-500 to-slate-600 dark:from-slate-400 dark:via-slate-300 dark:to-slate-400 rounded-full"
              animate={{
                backgroundPosition: ["0%", "100%", "0%"]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{
                backgroundSize: "200% auto",
                width: "100%"
              }}
            />
            {/* Glow effect */}
            <motion.div
              className={`absolute inset-0 blur-md ${
                theme === 'dark' 
                  ? 'bg-gradient-to-r from-purple-500/50 via-pink-500/50 to-indigo-500/50' 
                  : 'bg-gradient-to-r from-purple-400/30 via-pink-400/30 to-indigo-400/30'
              }`}
              animate={{
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>
          <motion.h2 
            className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white drop-shadow-lg tracking-wide"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            Analytics Overview
          </motion.h2>
        </div>
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-14 p-6 rounded-3xl bg-white/90 dark:bg-slate-900/90 shadow-2xl backdrop-blur-md relative overflow-hidden border border-slate-200/60 dark:border-slate-700/50"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {/* Animated border glow */}
          <motion.div
            className={`absolute inset-0 rounded-3xl ${
              theme === 'dark'
                ? 'bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-indigo-600/20'
                : 'bg-gradient-to-r from-purple-400/10 via-pink-400/10 to-indigo-400/10'
            }`}
            animate={{
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{ zIndex: -1 }}
          />
          <GenreChart />
          <PlatformChart />
          <RatingChart />
        </motion.div>
      </motion.div>

      {/* Trending Games Section - Move further down */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mb-12 mt-24"
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="flex items-center mb-6">
          <motion.div 
            className="h-1 rounded-full mr-4 relative overflow-hidden"
            initial={{ width: 0 }}
            animate={{ width: 48 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-slate-600 to-slate-500 dark:from-slate-400 dark:to-slate-300 rounded-full"
              animate={{
                x: [-20, 20, -20]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{ width: "150%" }}
            />
          </motion.div>
          <motion.h2 
            className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            Trending Games
          </motion.h2>
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
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="flex items-center mb-6">
          <motion.div 
            className="h-1 rounded-full mr-4 relative overflow-hidden"
            initial={{ width: 0 }}
            animate={{ width: 48 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-slate-600 to-slate-500 dark:from-slate-400 dark:to-slate-300 rounded-full"
              animate={{
                x: [-20, 20, -20]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{ width: "150%" }}
            />
          </motion.div>
          <motion.h2 
            className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            Live Streams
          </motion.h2>
        </div>
        <StreamList />
      </motion.div>

      {/* Footer with Copyright */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-16 mb-6 text-center"
      >
        <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            © 2025 GhostMetrics. All rights are reserved.
          </p>
        </div>
      </motion.footer>
      </div>
    </main>
  );
};

export default Dashboard;