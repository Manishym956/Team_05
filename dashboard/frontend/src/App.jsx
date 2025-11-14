import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Header from './components/Layout/Header';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import GameDetails from './components/Games/GameDetails';
import SearchModal from './components/Search/SearchModal';
import ProtectedRoute from './components/Auth/ProtectedRoute';

function App() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header onSearchClick={() => setIsSearchOpen(true)} />
      <Routes>
        <Route path="/login" element={<Login />} />
        {/* Public route - no auth required to browse games */}
        <Route path="/" element={<Dashboard />} />
        {/* Protected route - auth required to view game details */}
        <Route
          path="/game/:id"
          element={
            <ProtectedRoute>
              <GameDetails />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
}

export default App;
