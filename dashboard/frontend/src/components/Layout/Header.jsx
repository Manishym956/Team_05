import { Moon, Sun, Search } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import dragonLogo from '../../assets/dragon-logo.png';

const Header = ({ onSearchClick }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-gray-950/90 border-b-4 border-purple-500 dark:border-pink-500 shadow-xl backdrop-blur-lg transition-all duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center space-x-3 group">
            <motion.div
              whileHover={{ scale: 1.10, rotate: 8 }}
              whileTap={{ scale: 0.97 }}
              className="relative"
            >
              {/* Animated, glowing, glassy border */}
              <div className="p-[3px] rounded-2xl bg-gradient-to-br from-purple-400 via-pink-400 to-indigo-400 dark:from-purple-500 dark:via-pink-500 dark:to-indigo-500 shadow-2xl transition-all duration-300 group-hover:shadow-pink-400/40 group-hover:scale-105 animate-border-glow">
                <div className="rounded-2xl flex items-center justify-center w-16 h-16 bg-white/60 dark:bg-gray-900/70 backdrop-blur-md border-2 border-white/60 dark:border-gray-800/60 shadow-inner">
                  <img
                    src={dragonLogo}
                    alt="GhostMetrics Logo"
                    className="w-12 h-12 rounded-xl object-cover drop-shadow-xl transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
              </div>
              {/* Online indicator */}
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-900 animate-pulse shadow-md" />
            </motion.div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent drop-shadow-lg tracking-wide">
                GhostMetrics
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium italic">Gaming Analytics Platform</p>
            </div>
          </Link>

          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onSearchClick}
              className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm hover:shadow-md"
              aria-label="Search"
            >
              <Search className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, rotate: 15 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm hover:shadow-md"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-amber-500" />
              ) : (
                <Moon className="w-5 h-5 text-indigo-600" />
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

