import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
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
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Gaming Analytics Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Discover trending games, analyze statistics, and watch live streams
        </p>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <GenreChart />
        <PlatformChart />
        <RatingChart />
      </div>

      {/* Trending Games Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Trending Games</h2>
        <GameFilters
          onFilterChange={handleFilterChange}
          genres={genresData?.results || []}
          platforms={platformsData?.results || []}
        />
        <GameList searchParams={searchParams} />
      </div>

      {/* Twitch Streams Section */}
      <div className="mb-12">
        <StreamList />
      </div>
    </div>
  );
};

export default Dashboard;

