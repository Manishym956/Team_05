import { Moon, Sun, Search, LogIn, LogOut, User } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import dragonLogo from '../../assets/dragon-logo.png';

const Header = ({ onSearchClick }) => {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSignIn = () => {
    navigate('/login');
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-950/95 border-b border-slate-200 dark:border-slate-800 shadow-lg backdrop-blur-lg transition-all duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center space-x-3 group">
            <motion.div
              whileHover={{ scale: 1.10, rotate: 8 }}
              whileTap={{ scale: 0.97 }}
              className="relative"
            >
              {/* Animated, glowing, glassy border */}
              <div className="p-[3px] rounded-2xl bg-gradient-to-br from-slate-400 via-slate-500 to-slate-400 dark:from-slate-600 dark:via-slate-500 dark:to-slate-600 shadow-xl transition-all duration-300 group-hover:shadow-slate-400/40 dark:group-hover:shadow-slate-500/40 group-hover:scale-105">
                <div className="rounded-2xl flex items-center justify-center w-16 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-2 border-white/60 dark:border-slate-800/60 shadow-inner">
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
              <h1 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 dark:from-slate-200 dark:via-slate-300 dark:to-slate-200 bg-clip-text text-transparent drop-shadow-lg tracking-wide">
                GhostMetrics
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium italic">Gaming Analytics Platform</p>
            </div>
          </Link>

          <div className="flex items-center space-x-2">
            {onSearchClick && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onSearchClick}
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-200 shadow-sm hover:shadow-md"
                aria-label="Search"
              >
                <Search className="w-5 h-5 text-slate-700 dark:text-slate-300" />
              </motion.button>
            )}

            {/* Theme Toggle Button */}
            <motion.button
              whileHover={{ scale: 1.05, rotate: 15 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-200 shadow-sm hover:shadow-md"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-amber-500" />
              ) : (
                <Moon className="w-5 h-5 text-slate-600" />
              )}
            </motion.button>
            
            {/* Sign In / User Menu Button */}
            {isAuthenticated ? (
              <motion.div
                className="flex items-center space-x-2"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <motion.div
                  className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  whileHover={{ scale: 1.05 }}
                >
                  <User className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300 hidden sm:inline">
                    {user?.name || user?.email || 'User'}
                  </span>
                </motion.div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all duration-200 shadow-sm hover:shadow-md"
                  aria-label="Sign out"
                >
                  <LogOut className="w-5 h-5 text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400" />
                </motion.button>
              </motion.div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSignIn}
                className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 dark:bg-slate-600 dark:hover:bg-slate-500 text-white font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                aria-label="Sign in"
              >
                <LogIn className="w-5 h-5" />
                <span className="hidden sm:inline">Sign In</span>
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

