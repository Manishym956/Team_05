# Gaming Dashboard Backend

A Node.js/Express backend server that acts as a proxy and API gateway for the Gaming Dashboard application. It integrates with RAWG API for game data, Twitch API for live streaming data, and provides Google OAuth authentication.

## 🌐 Live Deployment

**Production URL**: [https://team-05-2.onrender.com](https://team-05-2.onrender.com)

**Health Check**: [https://team-05-2.onrender.com/health](https://team-05-2.onrender.com/health)

## 🚀 Features

- **RAWG API Integration**: Proxy server for game data, genres, platforms, and statistics
- **Twitch API Integration**: Fetch top streams and game-specific streams
- **Google OAuth Authentication**: Secure user authentication with JWT tokens
- **Rate Limiting**: Protect API endpoints from abuse
- **Response Caching**: In-memory caching to reduce API calls and improve performance
- **Comprehensive Logging**: Winston logger for structured logging
- **CORS Support**: Configured for cross-origin requests
- **Error Handling**: Graceful error handling with meaningful error messages

## 🛠️ Tech Stack

- **Node.js** - JavaScript runtime
- **Express 4.18.2** - Web framework
- **google-auth-library 10.5.0** - Google OAuth token verification
- **jsonwebtoken 9.0.2** - JWT token generation and verification
- **express-rate-limit 7.1.5** - API rate limiting
- **node-cache 5.1.2** - In-memory caching
- **winston 3.11.0** - Logging library
- **axios 1.6.2** - HTTP client

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- API keys (optional but recommended):
  - RAWG API key
  - Twitch API credentials
  - Google OAuth Client ID

## 🚀 Installation

1. **Navigate to the backend directory:**
   ```bash
   cd dashboard/backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

## ⚙️ Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=3001
FRONTEND_URL=http://localhost:5173

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
REFRESH_TOKEN_SECRET=your_super_secret_refresh_token_key_change_this
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d

# Google OAuth (Optional - for authentication)
GOOGLE_CLIENT_ID=your_google_client_id_here

# RAWG API (Optional - for game data)
RAWG_API_KEY=your_rawg_api_key_here

# Twitch API (Optional - for streaming data)
TWITCH_CLIENT_ID=your_twitch_client_id_here
TWITCH_CLIENT_SECRET=your_twitch_client_secret_here

# Environment
NODE_ENV=development
```

### Getting API Keys

#### RAWG API Key
1. Visit [RAWG API Documentation](https://rawg.io/apidocs)
2. Sign up for a free account
3. Generate an API key
4. Add it to your `.env` file

#### Twitch API Credentials
1. Visit [Twitch Developer Console](https://dev.twitch.tv/console)
2. Create a new application
3. Note your Client ID and Client Secret
4. Add them to your `.env` file

#### Google OAuth Client ID
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project or select existing one
3. Enable Google Identity Services API
4. Go to "Credentials" → "Create Credentials" → "OAuth client ID"
5. Choose "Web application"
6. Add authorized JavaScript origins: `http://localhost:5173`, `https://team-05-sand.vercel.app`
7. Copy the Client ID to your `.env` file

> **Note**: The server will run without these API keys, but the corresponding endpoints will return 503 errors. Authentication will be disabled without Google OAuth credentials.

## 🏃 Running the Server

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

The server will start on `http://localhost:3001` (or the port specified in `PORT` environment variable).

## 📡 API Endpoints

### Health Check
- `GET /health` - Check server status

### Authentication
- `POST /api/auth/google` - Authenticate with Google OAuth token
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/verify` - Verify authentication token
- `POST /api/auth/logout` - Logout user

### Games
- `GET /api/games/trending` - Get trending games
- `GET /api/games/search` - Search games with filters (query params: `q`, `genres`, `platforms`, `rating`, `dates`)
- `GET /api/games/:id` - Get game details

### Analytics
- `GET /api/genres/stats` - Get genre statistics
- `GET /api/platforms/stats` - Get platform statistics
- `GET /api/genres` - Get all genres
- `GET /api/platforms` - Get all platforms

### Twitch
- `GET /api/twitch/streams/top` - Get top Twitch streams
- `GET /api/twitch/streams/game/:id` - Get streams for a specific game

## 🔒 Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS Configuration**: Configured for multiple origins
- **JWT Authentication**: Access tokens (15m), Refresh tokens (7d)
- **Input Validation**: Server-side validation

## 💾 Caching Strategy

- **Trending Games**: 5 minutes
- **Game Search**: 10 minutes
- **Game Details**: 1 hour
- **Genre/Platform Stats**: 15 minutes
- **Genres/Platforms List**: 1 hour
- **Twitch Streams**: 30 seconds

## 🧪 Testing Endpoints

**Health Check:**
```bash
curl https://team-05-2.onrender.com/health
```

**Get Trending Games:**
```bash
curl https://team-05-2.onrender.com/api/games/trending
```

**Search Games:**
```bash
curl "https://team-05-2.onrender.com/api/games/search?q=elden"
```

## 🐛 Troubleshooting

### Port Already in Use
Change the port in `.env`:
```env
PORT=3002
```

### API Key Issues
- Verify API keys are correctly set in `.env`
- Check for typos or extra spaces
- Ensure API keys are active

### CORS Errors
- Verify `FRONTEND_URL` matches your frontend URL
- Check CORS configuration in `server.js`

### Authentication Not Working
- Verify `GOOGLE_CLIENT_ID` is set correctly
- Check that Google OAuth is initialized (check server startup logs)
- Ensure JWT secrets are set

## 📄 License

This project is part of Team 05's Gaming Dashboard application.

---

**Built with ❤️ using Node.js, Express, and modern JavaScript**
