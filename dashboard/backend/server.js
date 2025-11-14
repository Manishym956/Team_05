import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import NodeCache from 'node-cache';
import axios from 'axios';
import winston from 'winston';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Logger configuration
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

// Middleware
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

app.use('/api/', limiter);

// Cache configuration
const cache = new NodeCache({ stdTTL: 300 }); // 5 minutes default TTL

// RAWG API configuration
const RAWG_BASE_URL = 'https://api.rawg.io/api';
const RAWG_API_KEY = process.env.RAWG_API_KEY;

// Twitch API configuration
const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;
const TWITCH_CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET;
let twitchAccessToken = null;
let twitchTokenExpiry = null;

// Helper function to get Twitch access token
async function getTwitchAccessToken() {
  if (twitchAccessToken && twitchTokenExpiry && Date.now() < twitchTokenExpiry) {
    return twitchAccessToken;
  }

  try {
    const response = await axios.post(
      'https://id.twitch.tv/oauth2/token',
      null,
      {
        params: {
          client_id: TWITCH_CLIENT_ID,
          client_secret: TWITCH_CLIENT_SECRET,
          grant_type: 'client_credentials'
        }
      }
    );

    twitchAccessToken = response.data.access_token;
    twitchTokenExpiry = Date.now() + (response.data.expires_in * 1000) - 60000; // 1 min buffer
    return twitchAccessToken;
  } catch (error) {
    logger.error('Error getting Twitch access token:', error.message);
    throw error;
  }
}

// Helper function to make cached requests
async function cachedRequest(key, fetchFn, ttl = 300) {
  const cached = cache.get(key);
  if (cached) {
    return cached;
  }

  try {
    const data = await fetchFn();
    cache.set(key, data, ttl);
    return data;
  } catch (error) {
    logger.error(`Error fetching ${key}:`, error.message);
    throw error;
  }
}

// RAWG API Routes

// GET /api/games/trending
app.get('/api/games/trending', async (req, res) => {
  try {
    const data = await cachedRequest(
      'trending-games',
      async () => {
        const response = await axios.get(`${RAWG_BASE_URL}/games`, {
          params: {
            key: RAWG_API_KEY,
            page_size: 20,
            ordering: '-rating',
            dates: '2020-01-01,2025-12-31'
          }
        });
        return response.data;
      },
      300 // 5 minutes cache
    );

    res.json(data);
  } catch (error) {
    logger.error('Error fetching trending games:', error.message);
    res.status(500).json({ error: 'Failed to fetch trending games' });
  }
});

// GET /api/games/search
app.get('/api/games/search', async (req, res) => {
  try {
    const { q, genres, platforms, rating, released } = req.query;
    
    const cacheKey = `search-${JSON.stringify(req.query)}`;
    const data = await cachedRequest(
      cacheKey,
      async () => {
        const params = {
          key: RAWG_API_KEY,
          page_size: 20,
          search: q || undefined,
          genres: genres || undefined,
          platforms: platforms || undefined,
          rating: rating || undefined,
          dates: released || undefined
        };

        // Remove undefined params
        Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);

        const response = await axios.get(`${RAWG_BASE_URL}/games`, { params });
        return response.data;
      },
      600 // 10 minutes cache for search
    );

    res.json(data);
  } catch (error) {
    logger.error('Error searching games:', error.message);
    res.status(500).json({ error: 'Failed to search games' });
  }
});

// GET /api/games/:id
app.get('/api/games/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = await cachedRequest(
      `game-${id}`,
      async () => {
        const response = await axios.get(`${RAWG_BASE_URL}/games/${id}`, {
          params: { key: RAWG_API_KEY }
        });
        return response.data;
      },
      3600 // 1 hour cache for game details
    );

    res.json(data);
  } catch (error) {
    logger.error(`Error fetching game ${req.params.id}:`, error.message);
    res.status(500).json({ error: 'Failed to fetch game details' });
  }
});

// GET /api/genres/stats
app.get('/api/genres/stats', async (req, res) => {
  try {
    const data = await cachedRequest(
      'genres-stats',
      async () => {
        const [genresResponse, gamesResponse] = await Promise.all([
          axios.get(`${RAWG_BASE_URL}/genres`, {
            params: { key: RAWG_API_KEY, page_size: 100 }
          }),
          axios.get(`${RAWG_BASE_URL}/games`, {
            params: { key: RAWG_API_KEY, page_size: 100, ordering: '-rating' }
          })
        ]);

        // Count games per genre
        const genreCounts = {};
        gamesResponse.data.results.forEach(game => {
          game.genres.forEach(genre => {
            genreCounts[genre.id] = {
              id: genre.id,
              name: genre.name,
              count: (genreCounts[genre.id]?.count || 0) + 1
            };
          });
        });

        return {
          genres: genresResponse.data.results,
          distribution: Object.values(genreCounts).sort((a, b) => b.count - a.count)
        };
      },
      900 // 15 minutes cache
    );

    res.json(data);
  } catch (error) {
    logger.error('Error fetching genre stats:', error.message);
    res.status(500).json({ error: 'Failed to fetch genre statistics' });
  }
});

// GET /api/platforms/stats
app.get('/api/platforms/stats', async (req, res) => {
  try {
    const data = await cachedRequest(
      'platforms-stats',
      async () => {
        const [platformsResponse, gamesResponse] = await Promise.all([
          axios.get(`${RAWG_BASE_URL}/platforms`, {
            params: { key: RAWG_API_KEY, page_size: 100 }
          }),
          axios.get(`${RAWG_BASE_URL}/games`, {
            params: { key: RAWG_API_KEY, page_size: 100, ordering: '-rating' }
          })
        ]);

        // Count games per platform
        const platformCounts = {};
        gamesResponse.data.results.forEach(game => {
          game.platforms.forEach(platform => {
            const platformId = platform.platform.id;
            platformCounts[platformId] = {
              id: platformId,
              name: platform.platform.name,
              count: (platformCounts[platformId]?.count || 0) + 1
            };
          });
        });

        return {
          platforms: platformsResponse.data.results,
          distribution: Object.values(platformCounts).sort((a, b) => b.count - a.count)
        };
      },
      900 // 15 minutes cache
    );

    res.json(data);
  } catch (error) {
    logger.error('Error fetching platform stats:', error.message);
    res.status(500).json({ error: 'Failed to fetch platform statistics' });
  }
});

// Twitch API Routes

// GET /api/twitch/streams/top
app.get('/api/twitch/streams/top', async (req, res) => {
  try {
    const accessToken = await getTwitchAccessToken();
    
    const data = await cachedRequest(
      'twitch-top-streams',
      async () => {
        const response = await axios.get('https://api.twitch.tv/helix/streams', {
          headers: {
            'Client-ID': TWITCH_CLIENT_ID,
            'Authorization': `Bearer ${accessToken}`
          },
          params: {
            first: 20
          }
        });
        return response.data;
      },
      30 // 30 seconds cache for live data
    );

    res.json(data);
  } catch (error) {
    logger.error('Error fetching Twitch streams:', error.message);
    res.status(500).json({ error: 'Failed to fetch Twitch streams' });
  }
});

// GET /api/twitch/streams/game/:id
app.get('/api/twitch/streams/game/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const accessToken = await getTwitchAccessToken();
    
    const data = await cachedRequest(
      `twitch-game-streams-${id}`,
      async () => {
        const response = await axios.get('https://api.twitch.tv/helix/streams', {
          headers: {
            'Client-ID': TWITCH_CLIENT_ID,
            'Authorization': `Bearer ${accessToken}`
          },
          params: {
            game_id: id,
            first: 5
          }
        });
        return response.data;
      },
      30 // 30 seconds cache
    );

    res.json(data);
  } catch (error) {
    logger.error(`Error fetching Twitch streams for game ${id}:`, error.message);
    res.status(500).json({ error: 'Failed to fetch game streams' });
  }
});

// GET /api/genres
app.get('/api/genres', async (req, res) => {
  try {
    const data = await cachedRequest(
      'genres-list',
      async () => {
        const response = await axios.get(`${RAWG_BASE_URL}/genres`, {
          params: { key: RAWG_API_KEY, page_size: 100 }
        });
        return response.data;
      },
      3600 // 1 hour cache
    );

    res.json(data);
  } catch (error) {
    logger.error('Error fetching genres:', error.message);
    res.status(500).json({ error: 'Failed to fetch genres' });
  }
});

// GET /api/platforms
app.get('/api/platforms', async (req, res) => {
  try {
    const data = await cachedRequest(
      'platforms-list',
      async () => {
        const response = await axios.get(`${RAWG_BASE_URL}/platforms`, {
          params: { key: RAWG_API_KEY, page_size: 100 }
        });
        return response.data;
      },
      3600 // 1 hour cache
    );

    res.json(data);
  } catch (error) {
    logger.error('Error fetching platforms:', error.message);
    res.status(500).json({ error: 'Failed to fetch platforms' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`RAWG API Key: ${RAWG_API_KEY ? 'Configured' : 'Missing'}`);
  logger.info(`Twitch Client ID: ${TWITCH_CLIENT_ID ? 'Configured' : 'Missing'}`);
});

