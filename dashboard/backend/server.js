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


app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`RAWG API Key: ${RAWG_API_KEY ? 'Configured' : 'Missing'}`);
  logger.info(`Twitch Client ID: ${TWITCH_CLIENT_ID ? 'Configured' : 'Missing'}`);
});