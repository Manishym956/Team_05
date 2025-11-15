# Gaming Dashboard Backend

A Node.js/Express backend server that acts as a proxy and API gateway for the Gaming Dashboard application. It integrates with RAWG API for game data, Twitch API for live streaming data, and provides Google OAuth authentication.

## 🚀 Features

- **RAWG API Integration**: Proxy server for game data, genres, platforms, and statistics
- **Twitch API Integration**: Fetch top streams and game-specific streams
- **Google OAuth Authentication**: Secure user authentication with JWT tokens
- **Rate Limiting**: Protect API endpoints from abuse
- **Response Caching**: In-memory caching to reduce API calls and improve performance
- **Comprehensive Logging**: Winston logger for structured logging
- **CORS Support**: Configured for cross-origin requests
- **Error Handling**: Graceful error handling with meaningful error messages
- **Health Check Endpoint**: Monitor server status

## 🛠️ Tech Stack

### Core
- **Node.js** - JavaScript runtime
- **Express 4.18.2** - Web framework
- **ES Modules** - Modern JavaScript module system

### Authentication & Security
- **google-auth-library 10.5.0** - Google OAuth token verification
- **jsonwebtoken 9.0.2** - JWT token generation and verification
- **express-rate-limit 7.1.5** - API rate limiting

### External APIs
- **axios 1.6.2** - HTTP client for API requests
  - RAWG API - Game database and statistics
  - Twitch API - Live streaming data

### Utilities
- **node-cache 5.1.2** - In-memory caching
- **winston 3.11.0** - Logging library
- **dotenv 16.3.1** - Environment variable management
- **cors 2.8.5** - Cross-Origin Resource Sharing

## 📁 Project Structure

```
backend/
├── auth/                      # Authentication modules
│   ├── googleAuth.js         # Google OAuth verification
│   └── jwtUtils.js           # JWT token generation and verification
├── middleware/               # Express middleware
│   └── authMiddleware.js     # JWT authentication middleware
├── routes/                   # API routes
│   └── authRoutes.js         # Authentication endpoints
├── server.js                 # Main server file
├── package.json              # Dependencies and scripts
└── .env                      # Environment variables (create this)
```

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher recommended)
- **npm** (v9 or higher) or **yarn**
- API keys for:
  - RAWG API (optional but recommended)
  - Twitch API (optional)
  - Google OAuth Client ID (optional, for authentication)

## 🚀 Installation

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

## ⚙️ Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

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
3. Navigate to your account settings
4. Generate an API key
5. Add it to your `.env` file

#### Twitch API Credentials
1. Visit [Twitch Developer Console](https://dev.twitch.tv/console)
2. Create a new application
3. Note your Client ID and Client Secret
4. Add them to your `.env` file

#### Google OAuth Client ID
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth client ID"
5. Choose "Web application"
6. Add authorized JavaScript origins: `http://localhost:5173`
7. Copy the Client ID to your `.env` file

> **Note**: The server will still run without these API keys, but the corresponding endpoints will return 503 errors. Authentication will be disabled without Google OAuth credentials.

## 🏃 Running the Server

### Development Mode

Start the server with auto-reload (using Node.js watch mode):

```bash
npm run dev
```

### Production Mode

Start the server:

```bash
npm start
```

The server will start on `http://localhost:3001` (or the port specified in `PORT` environment variable).

## 📡 API Endpoints

### Health Check

#### `GET /health`
Check server status.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

### Authentication Endpoints

#### `POST /api/auth/google`
Authenticate with Google OAuth token.

**Request Body:**
```json
{
  "token": "google_id_token_here"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "User Name",
    "picture": "profile_picture_url"
  },
  "accessToken": "jwt_access_token",
  "refreshToken": "jwt_refresh_token"
}
```

#### `POST /api/auth/refresh`
Refresh access token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "refresh_token_here"
}
```

**Response:**
```json
{
  "success": true,
  "accessToken": "new_jwt_access_token"
}
```

#### `GET /api/auth/verify`
Verify current authentication token (requires authentication).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "user": {
    "userId": "user_id",
    "email": "user@example.com",
    "name": "User Name"
  }
}
```

#### `POST /api/auth/logout`
Logout endpoint (client-side token deletion).

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### Games API

#### `GET /api/games/trending`
Get trending games.

**Response:**
```json
{
  "count": 100,
  "results": [
    {
      "id": 123,
      "name": "Game Name",
      "released": "2024-01-01",
      "rating": 4.5,
      "background_image": "image_url",
      ...
    }
  ]
}
```

#### `GET /api/games/search`
Search games with filters.

**Query Parameters:**
- `q` (string, optional) - Search query
- `genres` (string, optional) - Genre ID
- `platforms` (string, optional) - Platform ID
- `rating` (string, optional) - Rating filter
- `dates` (string, optional) - Date range (format: `YYYY-MM-DD,YYYY-MM-DD`)

**Example:**
```
GET /api/games/search?q=elden&genres=4&platforms=1&rating=4
```

#### `GET /api/games/:id`
Get detailed information about a specific game.

**Response:**
```json
{
  "id": 123,
  "name": "Game Name",
  "description": "Game description...",
  "released": "2024-01-01",
  "rating": 4.5,
  "genres": [...],
  "platforms": [...],
  ...
}
```

### Analytics API

#### `GET /api/genres/stats`
Get genre statistics and distribution.

**Response:**
```json
{
  "genres": [...],
  "distribution": [
    {
      "id": 4,
      "name": "Action",
      "count": 150
    }
  ]
}
```

#### `GET /api/platforms/stats`
Get platform statistics and distribution.

**Response:**
```json
{
  "platforms": [...],
  "distribution": [
    {
      "id": 1,
      "name": "PC",
      "count": 200
    }
  ]
}
```

### Metadata API

#### `GET /api/genres`
Get all available genres.

**Response:**
```json
{
  "count": 50,
  "results": [
    {
      "id": 4,
      "name": "Action",
      "slug": "action",
      ...
    }
  ]
}
```

#### `GET /api/platforms`
Get all available platforms.

**Response:**
```json
{
  "count": 50,
  "results": [
    {
      "id": 1,
      "name": "PC",
      "slug": "pc",
      ...
    }
  ]
}
```

### Twitch API

#### `GET /api/twitch/streams/top`
Get top Twitch streams.

**Response:**
```json
{
  "data": [
    {
      "id": "stream_id",
      "user_id": "user_id",
      "user_name": "streamer_name",
      "game_id": "game_id",
      "game_name": "Game Name",
      "viewer_count": 1000,
      "title": "Stream Title",
      "thumbnail_url": "thumbnail_url"
    }
  ]
}
```

#### `GET /api/twitch/streams/game/:id`
Get Twitch streams for a specific game.

**Response:**
```json
{
  "data": [
    {
      "id": "stream_id",
      "user_name": "streamer_name",
      "game_name": "Game Name",
      "viewer_count": 500,
      ...
    }
  ]
}
```

## 🔒 Security Features

### Rate Limiting
- **Limit**: 100 requests per 15 minutes per IP
- **Scope**: All `/api/` endpoints
- **Response**: 429 Too Many Requests when limit exceeded

### CORS Configuration
- Configured for multiple origins
- Supports credentials
- Allows common HTTP methods

### JWT Authentication
- Access tokens expire in 15 minutes (configurable)
- Refresh tokens expire in 7 days (configurable)
- Secure token generation and verification
- Bearer token authentication

## 💾 Caching Strategy

The server uses in-memory caching with `node-cache` to reduce external API calls:

- **Trending Games**: 5 minutes (300 seconds)
- **Game Search**: 10 minutes (600 seconds)
- **Game Details**: 1 hour (3600 seconds)
- **Genre Stats**: 15 minutes (900 seconds)
- **Platform Stats**: 15 minutes (900 seconds)
- **Genres List**: 1 hour (3600 seconds)
- **Platforms List**: 1 hour (3600 seconds)
- **Twitch Top Streams**: 30 seconds
- **Twitch Game Streams**: 30 seconds

## 📝 Logging

The server uses Winston for structured logging:

- **Level**: `info` (default)
- **Format**: JSON with timestamps
- **Output**: Console

Log messages include:
- Server startup information
- API key configuration status
- Authentication events
- API request errors
- External API errors

## 🐛 Error Handling

The server provides meaningful error messages:

- **400 Bad Request**: Invalid request parameters
- **401 Unauthorized**: Authentication required or invalid token
- **500 Internal Server Error**: Server-side errors
- **503 Service Unavailable**: API key not configured

Error responses follow this format:
```json
{
  "error": "Error type",
  "message": "Detailed error message",
  "details": "Additional information (optional)"
}
```

## 🔧 Configuration

### Port Configuration
Default port is `3001`. Override with `PORT` environment variable.

### CORS Origins
Configure allowed origins in `server.js` or via `FRONTEND_URL` environment variable.

### Token Expiry
Configure JWT token expiry times:
- `ACCESS_TOKEN_EXPIRY`: Access token expiry (default: `15m`)
- `REFRESH_TOKEN_EXPIRY`: Refresh token expiry (default: `7d`)

## 🧪 Testing Endpoints

### Using cURL

**Health Check:**
```bash
curl http://localhost:3001/health
```

**Get Trending Games:**
```bash
curl http://localhost:3001/api/games/trending
```

**Search Games:**
```bash
curl "http://localhost:3001/api/games/search?q=elden"
```

**Authenticate:**
```bash
curl -X POST http://localhost:3001/api/auth/google \
  -H "Content-Type: application/json" \
  -d '{"token": "your_google_token"}'
```

## 🐛 Troubleshooting

### Port Already in Use
If port 3001 is already in use:
```bash
# Windows
netstat -ano | findstr :3001
taskkill /F /PID <process_id>

# Linux/Mac
lsof -ti:3001 | xargs kill -9
```

Or change the port in `.env`:
```env
PORT=3002
```

### API Key Issues
- Verify API keys are correctly set in `.env`
- Check for typos or extra spaces
- Ensure API keys are active and have proper permissions
- Check server logs for specific error messages

### CORS Errors
- Verify `FRONTEND_URL` matches your frontend URL
- Check that frontend is making requests to the correct backend URL
- Ensure CORS is properly configured in `server.js`

### Authentication Not Working
- Verify `GOOGLE_CLIENT_ID` is set correctly
- Check that Google OAuth is initialized (check server startup logs)
- Ensure JWT secrets are set and secure
- Verify token expiry settings

### External API Errors
- Check your internet connection
- Verify API keys are valid and not expired
- Check rate limits on external APIs (RAWG, Twitch)
- Review server logs for specific error messages

## 📊 Performance Considerations

- **Caching**: Reduces external API calls and improves response times
- **Rate Limiting**: Prevents API abuse and protects external API quotas
- **Error Handling**: Graceful degradation when external APIs are unavailable
- **Logging**: Minimal performance impact with structured logging

## 🔄 Development Guidelines

1. **Environment Variables**: Never commit `.env` files to version control
2. **Error Messages**: Provide clear, user-friendly error messages
3. **Logging**: Log important events and errors
4. **Caching**: Use appropriate cache TTLs based on data freshness requirements
5. **Security**: Always use secure JWT secrets in production
6. **API Keys**: Rotate API keys regularly and keep them secure

## 📦 Production Deployment

### Environment Setup
1. Set `NODE_ENV=production`
2. Use strong, unique JWT secrets
3. Configure proper CORS origins
4. Set up proper logging (consider file transport)
5. Use environment-specific API keys

### Security Checklist
- [ ] Strong JWT secrets configured
- [ ] CORS origins restricted
- [ ] Rate limiting enabled
- [ ] API keys secured
- [ ] Error messages don't expose sensitive information
- [ ] HTTPS enabled (if applicable)

## 📄 License

This project is part of Team 05's Gaming Dashboard application.

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📞 Support

For issues or questions, please contact the development team or create an issue in the project repository.

---

**Built with ❤️ using Node.js, Express, and modern JavaScript**

