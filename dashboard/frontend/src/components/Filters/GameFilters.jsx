import { useState, useEffect, useRef } from 'react';
import { Filter, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const GameFilters = ({ onFilterChange, genres = [], platforms = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    genre: '',
    platform: '',
    rating: '',
    year: '',
  });
  const debounceTimerRef = useRef(null);

  const handleFilterChange = (key, value) => {
    // Trim string values and ensure empty strings are treated as empty
    const cleanValue = typeof value === 'string' ? value.trim() : value;
    const newFilters = { ...filters, [key]: cleanValue };
    setFilters(newFilters);
    
    // For year input, validate and debounce
    if (key === 'year') {
      // Clear previous timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      
      // Only trigger filter if year is complete (4 digits) and valid
      const year = parseInt(cleanValue, 10);
      const currentYear = new Date().getFullYear();
      
      if (cleanValue === '') {
        // Empty year - trigger immediately to clear filter
        onFilterChange(newFilters);
      } else if (!isNaN(year) && cleanValue.length === 4 && year >= 1970 && year <= currentYear + 1) {
        // Valid complete year - debounce to avoid multiple calls while typing
        debounceTimerRef.current = setTimeout(() => {
          onFilterChange(newFilters);
        }, 500); // 500ms debounce
      }
    } else {
      // For other filters, trigger immediately
      onFilterChange(newFilters);
    }
  };

  const handleYearBlur = (e) => {
    // Trigger filter when user leaves the year input field
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    // Use the current input value, not state (which might be stale)
    const yearValue = e.target.value.trim();
    const currentFilters = { ...filters, year: yearValue };
    
    // Validate and trigger if year is valid or empty
    if (yearValue === '') {
      setFilters(currentFilters);
      onFilterChange(currentFilters);
    } else {
      const year = parseInt(yearValue, 10);
      const currentYear = new Date().getFullYear();
      if (!isNaN(year) && yearValue.length === 4 && year >= 1970 && year <= currentYear + 1) {
        setFilters(currentFilters);
        onFilterChange(currentFilters);
      } else {
        // Invalid year - reset to empty and trigger
        const resetFilters = { ...filters, year: '' };
        setFilters(resetFilters);
        onFilterChange(resetFilters);
      }
    }
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const clearFilters = () => {
    const emptyFilters = { genre: '', platform: '', rating: '', year: '' };
    setFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  const hasActiveFilters = Object.values(filters).some(v => v !== '');

  return (
    <div className="mb-8">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl shadow-lg hover:shadow-glow transition-all duration-200 font-medium"
      >
        <Filter className="w-5 h-5" />
        <span>Filters</span>
        {hasActiveFilters && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs rounded-full font-bold"
          >
            {Object.values(filters).filter(v => v !== '').length} Active
          </motion.span>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="mt-4 bg-white dark:bg-gray-800 rounded-2xl shadow-soft p-6 border border-gray-100 dark:border-gray-700/50"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">Filter Games</h3>
              </div>
              {hasActiveFilters && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={clearFilters}
                  className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors font-medium"
                >
                  <X className="w-4 h-4" />
                  <span>Clear All</span>
                </motion.button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Genre</label>
                <select
                  value={filters.genre}
                  onChange={(e) => handleFilterChange('genre', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                >
                  <option value="">All Genres</option>
                  {genres.map((genre) => (
                    <option key={genre.id} value={genre.id}>
                      {genre.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Platform</label>
                <select
                  value={filters.platform}
                  onChange={(e) => handleFilterChange('platform', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                >
                  <option value="">All Platforms</option>
                  {platforms.map((platform) => (
                    <option key={platform.id} value={platform.id}>
                      {platform.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Min Rating</label>
                <select
                  value={filters.rating}
                  onChange={(e) => handleFilterChange('rating', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                >
                  <option value="">Any Rating</option>
                  <option value="4">4.0+ ⭐</option>
                  <option value="4.5">4.5+ ⭐</option>
                  <option value="4.7">4.7+ ⭐</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Release Year</label>
                <input
                  type="number"
                  value={filters.year}
                  onChange={(e) => handleFilterChange('year', e.target.value)}
                  onBlur={handleYearBlur}
                  placeholder="e.g., 2023"
                  min="1970"
                  max={new Date().getFullYear() + 1}
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Enter a 4-digit year (1970-{new Date().getFullYear() + 1})</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GameFilters;

