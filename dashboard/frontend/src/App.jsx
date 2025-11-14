import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Layout/Header';
import Dashboard from './pages/Dashboard';
import GameDetails from './components/Games/GameDetails';
import SearchModal from './components/Search/SearchModal';

function App() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header onSearchClick={() => setIsSearchOpen(true)} />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/game/:id" element={<GameDetails />} />
      </Routes>
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
}

export default App;
