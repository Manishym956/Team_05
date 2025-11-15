# 🎮 GhostMetrics - Gaming Analytics Dashboard

A comprehensive, modern gaming analytics platform that provides real-time insights into trending games, platform statistics, genre distributions, and live Twitch streams. Built with React, Node.js, and integrated with RAWG API and Twitch API.

## 🌐 Live Application

- **Frontend (Production)**: [https://team-05-sand.vercel.app/](https://team-05-sand.vercel.app/)
- **Backend API (Production)**: [https://team-05-2.onrender.com](https://team-05-2.onrender.com)
- **API Health Check**: [https://team-05-2.onrender.com/health](https://team-05-2.onrender.com/health)

## 📸 Screenshots

### Dashboard - Analytics Overview
<img width="933" height="491" alt="image" src="https://github.com/user-attachments/assets/3d7fbc2f-7e46-43b8-bae0-3d84e30f0a6d" />
*Interactive analytics dashboard showing genre distribution, platform popularity, and rating trends*

### Login Page
<img width="870" height="495" alt="image" src="https://github.com/user-attachments/assets/dab6d987-06ea-4dbc-8799-83c5e404c0c1" />
*Secure Google OAuth authentication page with professional design*

### Trending Games
<img width="869" height="499" alt="image" src="https://github.com/user-attachments/assets/d7534624-603b-4c73-81c5-bb947e2692dc" />
*Browse and discover trending games with advanced filtering options*

### Live Streams
<img width="875" height="498" alt="image" src="https://github.com/user-attachments/assets/51748f67-c70a-42ba-b897-da424f69240c" />
*Real-time Twitch stream integration showing top live gaming streams*

## ✨ Features

- **Game Discovery**: Browse trending games, search with advanced filters, and view detailed game information
- **Analytics Dashboard**: Interactive charts for genre distribution, platform statistics, and rating trends
- **Twitch Integration**: View top live streams and game-specific streams in real-time
- **Google OAuth Authentication**: Secure login with Google account
- **Dark/Light Mode**: Professional theme switching with smooth transitions
- **Responsive Design**: Fully optimized for desktop, tablet, and mobile devices
- **Real-time Data**: Live updates from RAWG API and Twitch API
- **Advanced Search**: Filter games by genre, platform, rating, and release year
- **Smooth Animations**: Enhanced UX with Framer Motion animations

## 🛠️ Tech Stack

### Frontend
- React 19.2.0, Vite 7.2.2, React Router DOM 6.22.0
- TanStack React Query 5.17.0, Tailwind CSS 3.4.1
- Framer Motion 11.0.0, Chart.js 4.4.0
- @react-oauth/google 0.12.2, Axios 1.6.2

### Backend
- Node.js, Express 4.18.2
- google-auth-library 10.5.0, jsonwebtoken 9.0.2
- express-rate-limit 7.1.5, node-cache 5.1.2
- winston 3.11.0, axios 1.6.2

### External APIs
- RAWG API - Game database and statistics
- Twitch API - Live streaming data
- Google OAuth - User authentication

## 🏗️ Project Structure

```
Team 05/
├── dashboard/
│   ├── frontend/          # React frontend application
│   │   ├── src/
│   │   ├── package.json
│   │   └── README.md
│   │
│   └── backend/           # Node.js/Express backend
│       ├── auth/
│       ├── middleware/
│       ├── routes/
│       ├── server.js
│       ├── package.json
│       └── README.md
│
├── GOOGLE_OAUTH_SETUP_GUIDE.md
├── QUICK_FIX_403_ERROR.md
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** (v9 or higher)

### Installation

1. **Clone the repository:**
```bash
git clone <repository-url>
   cd "Team 05"
```

2. **Install Frontend Dependencies:**
```bash
   cd dashboard/frontend
npm install
```

3. **Install Backend Dependencies:**
```bash
   cd ../backend
npm install
```

### Configuration

#### Frontend Environment Variables

Create `dashboard/frontend/.env`:
```env
# Backend API URL (defaults to http://localhost:3001 if not set)
VITE_API_URL=http://localhost:3001

# Google OAuth Client ID (optional - for authentication)
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

#### Backend Environment Variables

Create `dashboard/backend/.env`:
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

### Running the Application

1. **Start Backend Server:**
   ```bash
   cd dashboard/backend
   npm run dev
   ```
   Backend will run on `http://localhost:3001`

2. **Start Frontend Development Server:**
   ```bash
   cd dashboard/frontend
   npm run dev
   ```
   Frontend will run on `http://localhost:5173`

3. **Open in Browser:**
   Navigate to `http://localhost:5173`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/google` - Authenticate with Google OAuth
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/verify` - Verify authentication token
- `POST /api/auth/logout` - Logout user

### Games
- `GET /api/games/trending` - Get trending games
- `GET /api/games/search` - Search games with filters
- `GET /api/games/:id` - Get game details

### Analytics
- `GET /api/genres/stats` - Get genre statistics
- `GET /api/platforms/stats` - Get platform statistics
- `GET /api/genres` - Get all genres
- `GET /api/platforms` - Get all platforms

### Twitch
- `GET /api/twitch/streams/top` - Get top Twitch streams
- `GET /api/twitch/streams/game/:id` - Get streams for a specific game

### Health Check
- `GET /health` - Server health status

For detailed API documentation, see [Backend README](dashboard/backend/README.md).

## 🔐 Authentication Setup

### Google OAuth Configuration

1. **Get Google OAuth Client ID:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a project or select existing one
   - Enable Google Identity Services API
   - Create OAuth 2.0 Client ID (Web application)
   - Add authorized JavaScript origins:
     - `http://localhost:5173`
     - `http://127.0.0.1:5173`
     - `https://team-05-sand.vercel.app`

2. **Add to Environment Variables:**
   - Frontend: `VITE_GOOGLE_CLIENT_ID`
   - Backend: `GOOGLE_CLIENT_ID`

For detailed setup instructions, see [GOOGLE_OAUTH_SETUP_GUIDE.md](GOOGLE_OAUTH_SETUP_GUIDE.md).

## 🚀 Deployment

### Frontend (Vercel)
- **URL**: [https://team-05-sand.vercel.app/](https://team-05-sand.vercel.app/)
- **Platform**: Vercel
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### Backend (Render)
- **URL**: [https://team-05-2.onrender.com](https://team-05-2.onrender.com)
- **Platform**: Render
- **Runtime**: Node.js
- **Start Command**: `npm start`

## 📚 Documentation

- **[Frontend README](dashboard/frontend/README.md)** - Frontend setup and documentation
- **[Backend README](dashboard/backend/README.md)** - Backend API documentation
- **[Google OAuth Setup Guide](GOOGLE_OAUTH_SETUP_GUIDE.md)** - OAuth configuration guide
- **[OAuth Troubleshooting](QUICK_FIX_403_ERROR.md)** - Common OAuth issues and fixes

## 🐛 Troubleshooting

### Common Issues

1. **OAuth 403 Error**
   - See [QUICK_FIX_403_ERROR.md](QUICK_FIX_403_ERROR.md)
   - Verify authorized origins in Google Cloud Console
   - Wait 5 minutes after configuration changes

2. **API Connection Issues**
   - Verify backend is running
   - Check `VITE_API_URL` in frontend `.env`
   - Verify CORS configuration

3. **Build Errors**
   - Clear `node_modules` and reinstall
   - Check Node.js version compatibility
   - Verify all environment variables are set

For more troubleshooting, see individual README files in frontend and backend directories.

## 📄 License

This project is part of Team 05's Gaming Dashboard application.

## 📞 Support

For issues or questions:
- Check the documentation in respective README files
- Review troubleshooting guides
- Contact the development team

---

**Built with ❤️ by Team 05**

**Frontend**: React + Vite + Tailwind CSS  
**Backend**: Node.js + Express  
**Deployment**: Vercel + Render
