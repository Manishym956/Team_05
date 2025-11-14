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

app.use(cors());
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: 'Too many requests from this IP, please try again later.'
});

app.use('/api/', limiter);

const cache = new NodeCache({ stdTTL: 300 }); 

const RAWG_BASE_URL = 'https://api.rawg.io/api';
const RAWG_API_KEY = process.env.RAWG_API_KEY;

const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;
const TWITCH_CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET;

if (!RAWG_API_KEY || RAWG_API_KEY === 'your_rawg_api_key_here') {
  logger.warn('⚠️  RAWG API Key is not configured. RAWG endpoints will not work.');
  logger.warn('   Get your API key at: https://rawg.io/apidocs');
}

if (!TWITCH_CLIENT_ID || !TWITCH_CLIENT_SECRET) {
  logger.warn('⚠️  Twitch API credentials are not configured. Twitch endpoints will not work.');
}
let twitchAccessToken = null;
let twitchTokenExpiry = null;


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

app.get('/api/games/trending', async (req, res) => {
  try {
    if (!RAWG_API_KEY || RAWG_API_KEY === 'your_rawg_api_key_here') {
      return res.status(503).json({ 
        error: 'RAWG API key not configured',
        message: 'Please add your RAWG API key to the .env file. Get one at https://rawg.io/apidocs'
      });
    }

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
    const errorMessage = error.response?.data?.detail || error.message || 'Failed to fetch trending games';
    res.status(500).json({ 
      error: 'Failed to fetch trending games',
      message: errorMessage,
      details: error.response?.status === 401 ? 'Invalid API key' : undefined
    });
  }
});

// GET /api/games/search
app.get('/api/games/search', async (req, res) => {
  try {
    if (!RAWG_API_KEY || RAWG_API_KEY === 'your_rawg_api_key_here') {
      return res.status(503).json({ 
        error: 'RAWG API key not configured',
        message: 'Please add your RAWG API key to the .env file. Get one at https://rawg.io/apidocs'
      });
    }

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
    const errorMessage = error.response?.data?.detail || error.message || 'Failed to search games';
    res.status(500).json({ 
      error: 'Failed to search games',
      message: errorMessage,
      details: error.response?.status === 401 ? 'Invalid API key' : undefined
    });
  }
});

app.get('/api/games/:id', async (req, res) => {
  try {
    if (!RAWG_API_KEY || RAWG_API_KEY === 'your_rawg_api_key_here') {
      return res.status(503).json({ 
        error: 'RAWG API key not configured',
        message: 'Please add your RAWG API key to the .env file. Get one at https://rawg.io/apidocs'
      });
    }

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
    const errorMessage = error.response?.data?.detail || error.message || 'Failed to fetch game details';
    res.status(500).json({ 
      error: 'Failed to fetch game details',
      message: errorMessage
    });
  }
});

// GET /api/genres/stats
app.get('/api/genres/stats', async (req, res) => {
  try {
    if (!RAWG_API_KEY || RAWG_API_KEY === 'your_rawg_api_key_here') {
      return res.status(503).json({ 
        error: 'RAWG API key not configured',
        message: 'Please add your RAWG API key to the .env file. Get one at https://rawg.io/apidocs'
      });
    }

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
    const errorMessage = error.response?.data?.detail || error.message || 'Failed to fetch genre statistics';
    res.status(500).json({ 
      error: 'Failed to fetch genre statistics',
      message: errorMessage
    });
  }
});

app.get('/api/platforms/stats', async (req, res) => {
  try {
    if (!RAWG_API_KEY || RAWG_API_KEY === 'your_rawg_api_key_here') {
      return res.status(503).json({ 
        error: 'RAWG API key not configured',
        message: 'Please add your RAWG API key to the .env file. Get one at https://rawg.io/apidocs'
      });
    }

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
    const errorMessage = error.response?.data?.detail || error.message || 'Failed to fetch platform statistics';
    res.status(500).json({ 
      error: 'Failed to fetch platform statistics',
      message: errorMessage
    });
  }
});

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

app.get('/api/genres', async (req, res) => {
  try {
    if (!RAWG_API_KEY || RAWG_API_KEY === 'your_rawg_api_key_here') {
      return res.status(503).json({ 
        error: 'RAWG API key not configured',
        message: 'Please add your RAWG API key to the .env file. Get one at https://rawg.io/apidocs'
      });
    }

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
    const errorMessage = error.response?.data?.detail || error.message || 'Failed to fetch genres';
    res.status(500).json({ 
      error: 'Failed to fetch genres',
      message: errorMessage
    });
  }
});

app.get('/api/platforms', async (req, res) => {
  try {
    if (!RAWG_API_KEY || RAWG_API_KEY === 'your_rawg_api_key_here') {
      return res.status(503).json({ 
        error: 'RAWG API key not configured',
        message: 'Please add your RAWG API key to the .env file. Get one at https://rawg.io/apidocs'
      });
    }

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
    const errorMessage = error.response?.data?.detail || error.message || 'Failed to fetch platforms';
    res.status(500).json({ 
      error: 'Failed to fetch platforms',
      message: errorMessage
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`RAWG API Key: ${RAWG_API_KEY ? 'Configured' : 'Missing'}`);
  logger.info(`Twitch Client ID: ${TWITCH_CLIENT_ID ? 'Configured' : 'Missing'}`);
});