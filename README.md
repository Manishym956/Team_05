# GhostMetrics - Esports & Gaming Stats Dashboard

A comprehensive gaming analytics platform combining RAWG game data with live Twitch streaming metrics. Built with React, Node.js, and modern web technologies.

## 🎮 Features

### RAWG API Integration
- **Trending Games Widget**: Top 20 games with ratings, platforms, and release dates
- **Advanced Search & Filters**: Search by genre, platform, rating, and release year
- **Detailed Game View**: Full descriptions, screenshots, Metacritic scores, and platform links
- **Analytics Dashboards**:
  - Genre distribution (pie chart)
  - Platform popularity (bar chart)
  - Rating trends over time (line chart)

### Twitch API Integration
- **Live Streams Dashboard**: Top 20 streams with real-time viewer counts (30s updates)
- **Game-Specific Streams**: Top 5 streamers per game with total viewership
- **Real-time Updates**: Automatic refresh every 30 seconds

### User Experience
- **Dark/Light Theme**: System preference detection with manual override
- **Responsive Design**: Optimized for tablets and desktops
- **Loading States**: Skeleton screens and smooth transitions
- **Search Modal**: Quick game search with instant results

## 🛠️ Tech Stack

### Frontend
- React 18 + Vite
- React Router v6
- Context API + useReducer
- Axios + React Query (caching)
- Chart.js + react-chartjs-2
- Tailwind CSS + lucide-react
- Framer Motion

### Backend
- Node.js + Express.js
- express-rate-limit
- node-cache (5-15min TTL)
- Winston (logging)
- CORS enabled

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- RAWG API Key ([Get one here](https://rawg.io/apidocs))
- Twitch API Credentials ([Get them here](https://dev.twitch.tv/console/apps))

### Backend Setup

1. Navigate to the backend directory:
```bash
cd dashboard/backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```bash
cp .env.example .env
```

4. Add your API keys to `.env`:
```env
PORT=3001
RAWG_API_KEY=your_rawg_api_key_here
TWITCH_CLIENT_ID=your_twitch_client_id_here
TWITCH_CLIENT_SECRET=your_twitch_client_secret_here
```

5. Start the server:
```bash
npm run dev
```

The backend will run on `http://localhost:3001`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd dashboard/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (optional, defaults to localhost:3001):
```env
VITE_API_URL=http://localhost:3001
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## 🚀 Usage

1. Start both backend and frontend servers
2. Open `http://localhost:5173` in your browser
3. Browse trending games, view analytics charts, and watch live Twitch streams
4. Use the search icon to quickly find games
5. Click on any game card to view detailed information
6. Toggle dark/light theme using the moon/sun icon

## 📁 Project Structure

```
GhostMetrics/
├── dashboard/
│   ├── backend/
│   │   ├── server.js          # Express server with API proxy
│   │   ├── package.json
│   │   └── .env.example
│   └── frontend/
│       ├── src/
│       │   ├── components/    # React components
│       │   │   ├── Charts/    # Chart components
│       │   │   ├── Games/     # Game-related components
│       │   │   ├── Layout/    # Header, etc.
│       │   │   ├── Twitch/    # Twitch stream components
│       │   │   ├── Search/    # Search modal
│       │   │   └── Filters/   # Filter components
│       │   ├── context/       # React Context providers
│       │   ├── pages/         # Page components
│       │   ├── services/      # API service layer
│       │   ├── App.jsx        # Main app component
│       │   └── main.jsx       # Entry point
│       ├── package.json
│       └── vite.config.js
└── README.md
```

## 🔌 API Endpoints

### RAWG Endpoints
- `GET /api/games/trending` - Get top 20 trending games
- `GET /api/games/search?q={query}` - Search games
- `GET /api/games/:id` - Get game details
- `GET /api/genres/stats` - Get genre statistics
- `GET /api/platforms/stats` - Get platform statistics

### Twitch Endpoints
- `GET /api/twitch/streams/top` - Get top 20 live streams
- `GET /api/twitch/streams/game/:id` - Get streams for a specific game

## 🎨 Features in Detail

### Caching Strategy
- Trending games: 5 minutes
- Search results: 10 minutes
- Game details: 1 hour
- Analytics: 15 minutes
- Twitch streams: 30 seconds (real-time)

### Rate Limiting
- 100 requests per 15 minutes per IP
- Prevents API abuse and ensures fair usage

### Error Handling
- Graceful error messages
- Fallback to cached data when available
- Retry mechanisms for failed requests

## 🚢 Deployment

### Backend Deployment (Heroku/Railway/Render)

1. Set environment variables in your hosting platform
2. Update CORS settings if needed
3. Deploy the backend directory

### Frontend Deployment (Vercel/Netlify)

1. Set `VITE_API_URL` to your backend URL
2. Build the project: `npm run build`
3. Deploy the `dist` folder

## 📝 Environment Variables

### Backend (.env)
```
PORT=3001
RAWG_API_KEY=your_key_here
TWITCH_CLIENT_ID=your_client_id_here
TWITCH_CLIENT_SECRET=your_client_secret_here
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:3001
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- [RAWG Video Game Database API](https://rawg.io/apidocs)
- [Twitch API](https://dev.twitch.tv/docs/api/)
- All the amazing open-source libraries used in this project

## 📧 Support

For issues, questions, or contributions, please open an issue on GitHub.

---

Built with ❤️ for the gaming community

