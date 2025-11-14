# Quick Start Guide

## Prerequisites

1. **Node.js 18+** installed
2. **RAWG API Key** - Get one at https://rawg.io/apidocs (free tier: 20K requests/month)
3. **Twitch API Credentials** - Get them at https://dev.twitch.tv/console/apps

## Setup Steps

### 1. Backend Setup

```bash
cd dashboard/backend
npm install
```

Create a `.env` file:
```env
PORT=3001
RAWG_API_KEY=your_rawg_api_key_here
TWITCH_CLIENT_ID=your_twitch_client_id_here
TWITCH_CLIENT_SECRET=your_twitch_client_secret_here
```

Start the backend:
```bash
npm run dev
```

The backend will run on `http://localhost:3001`

### 2. Frontend Setup

Open a new terminal:

```bash
cd dashboard/frontend
npm install
```

Start the frontend:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

### 3. Access the Application

Open your browser and navigate to `http://localhost:5173`

## Features to Try

1. **Browse Trending Games** - View the top 20 trending games on the dashboard
2. **Search Games** - Click the search icon in the header to search for games
3. **Filter Games** - Use the filters to narrow down by genre, platform, rating, or year
4. **View Game Details** - Click on any game card to see detailed information
5. **View Analytics** - Check out the genre, platform, and rating trend charts
6. **Watch Live Streams** - Scroll down to see live Twitch streams (updates every 30 seconds)
7. **Toggle Theme** - Click the moon/sun icon to switch between dark and light themes

## Troubleshooting

### Backend won't start
- Check that all environment variables are set in `.env`
- Ensure port 3001 is not already in use
- Verify your API keys are correct

### Frontend can't connect to backend
- Ensure the backend is running on port 3001
- Check that `VITE_API_URL` in frontend `.env` matches your backend URL
- Check browser console for CORS errors

### No games showing
- Verify your RAWG API key is valid
- Check backend logs for API errors
- Ensure you haven't exceeded API rate limits

### No Twitch streams showing
- Verify your Twitch Client ID and Secret are correct
- Check that Twitch API credentials are properly configured
- Some games may not have active streams

## Next Steps

- Customize the dashboard layout
- Add more filters and search options
- Explore the codebase to understand the architecture
- Deploy to production (see README.md for deployment instructions)

