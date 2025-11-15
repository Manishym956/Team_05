# Gaming Dashboard

A full-stack web application for exploring gaming statistics, trending games, and live Twitch streams. Built with React and Node.js/Express.

![Tech Stack](https://img.shields.io/badge/React-19.2.0-blue)
![Tech Stack](https://img.shields.io/badge/Node.js-18+-green)
![Tech Stack](https://img.shields.io/badge/Express-4.18.2-black)
![Tech Stack](https://img.shields.io/badge/Tailwind-3.4.1-38bdf8)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Detailed Setup](#detailed-setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

## 🎮 Overview

The Gaming Dashboard is a comprehensive platform that provides:

- **Game Discovery**: Browse and search through thousands of games with advanced filtering
- **Analytics**: Visualize gaming trends with interactive charts and statistics
- **Live Streams**: View top Twitch streams and game-specific live content
- **User Authentication**: Secure login with Google OAuth
- **Modern UI**: Responsive design with dark mode support

The application consists of two main components:
- **Frontend**: React-based single-page application (SPA)
- **Backend**: Express.js API server that proxies external APIs

## ✨ Features

### Frontend Features
- 🎨 Modern, responsive UI with Tailwind CSS
- 🌙 Dark mode support
- 🔍 Advanced game search and filtering
- 📊 Interactive charts and analytics
- 🎬 Live Twitch stream integration
- 🔐 Google OAuth authentication
- ⚡ Fast performance with React Query caching
- 🎭 Smooth animations with Framer Motion

### Backend Features
- 🔄 RAWG API integration for game data
- 📺 Twitch API integration for live streams
- 🔒 JWT-based authentication
- ⚡ Response caching for improved performance
- 🛡️ Rate limiting for API protection
- 📝 Comprehensive logging with Winston
- 🌐 CORS configuration for cross-origin requests

## 🛠️ Tech Stack

### Frontend
- **React 19.2.0** - UI library
- **Vite 7.2.2** - Build tool
- **React Router DOM 6.22.0** - Routing
- **TanStack React Query 5.17.0** - Data fetching
- **Tailwind CSS 3.4.1** - Styling
- **Framer Motion 11.0.0** - Animations
- **Chart.js 4.4.0** - Charts
- **Axios 1.6.2** - HTTP client

### Backend
- **Node.js** - Runtime
- **Express 4.18.2** - Web framework
- **Axios 1.6.2** - HTTP client
- **jsonwebtoken 9.0.2** - JWT authentication
- **google-auth-library 10.5.0** - Google OAuth
- **node-cache 5.1.2** - Caching
- **winston 3.11.0** - Logging
- **express-rate-limit 7.1.5** - Rate limiting

## 📁 Project Structure

```
dashboard/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── context/         # React Context providers
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   └── assets/          # Static assets
│   ├── public/              # Public assets
│   ├── package.json
│   └── README.md            # Frontend documentation
│
├── backend/                 # Express backend server
│   ├── auth/               # Authentication modules
│   ├── middleware/         # Express middleware
│   ├── routes/             # API routes
│   ├── server.js           # Main server file
│   ├── package.json
│   └── README.md           # Backend documentation
│
└── README.md               # This file
```

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher recommended)
- **npm** (v9 or higher) or **yarn**
- **Git** (for cloning the repository)

### Optional API Keys

The application can run without these, but some features will be limited:

- **RAWG API Key** - For game data (get one at [rawg.io/apidocs](https://rawg.io/apidocs))
- **Twitch API Credentials** - For live streams (get them at [dev.twitch.tv](https://dev.twitch.tv/console))
- **Google OAuth Client ID** - For authentication (get one at [Google Cloud Console](https://console.cloud.google.com/))

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Team_05/dashboard
```

### 2. Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd ../frontend
npm install
```

### 3. Configure Environment Variables

**Backend** - Create `backend/.env`:
```env
PORT=3001
JWT_SECRET=your_jwt_secret_here
REFRESH_TOKEN_SECRET=your_refresh_token_secret_here
GOOGLE_CLIENT_ID=your_google_client_id
RAWG_API_KEY=your_rawg_api_key
TWITCH_CLIENT_ID=your_twitch_client_id
TWITCH_CLIENT_SECRET=your_twitch_client_secret
```

**Frontend** - Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:3001
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

### 4. Start the Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 5. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

## 📖 Detailed Setup

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with your configuration (see [Backend README](./backend/README.md) for details)

4. Start the server:
   ```bash
   npm start
   # or for development with auto-reload
   npm run dev
   ```

For detailed backend documentation, see [Backend README](./backend/README.md).

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with your configuration (see [Frontend README](./frontend/README.md) for details)

4. Start the development server:
   ```bash
   npm run dev
   ```

For detailed frontend documentation, see [Frontend README](./frontend/README.md).

## 🏃 Running the Application

### Development Mode

**Start Backend:**
```bash
cd backend
npm run dev
```

**Start Frontend:**
```bash
cd frontend
npm run dev
```

### Production Mode

**Build Frontend:**
```bash
cd frontend
npm run build
```

**Start Backend:**
```bash
cd backend
npm start
```

**Preview Frontend Build:**
```bash
cd frontend
npm run preview
```

## 📡 API Documentation

The backend provides a RESTful API with the following main endpoints:

### Authentication
- `POST /api/auth/google` - Authenticate with Google
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/verify` - Verify token
- `POST /api/auth/logout` - Logout

### Games
- `GET /api/games/trending` - Get trending games
- `GET /api/games/search` - Search games
- `GET /api/games/:id` - Get game details

### Analytics
- `GET /api/genres/stats` - Genre statistics
- `GET /api/platforms/stats` - Platform statistics

### Metadata
- `GET /api/genres` - Get all genres
- `GET /api/platforms` - Get all platforms

### Twitch
- `GET /api/twitch/streams/top` - Top streams
- `GET /api/twitch/streams/game/:id` - Game-specific streams

### Health
- `GET /health` - Server health check

For complete API documentation with request/response examples, see [Backend README](./backend/README.md#api-endpoints).

## ⚙️ Environment Variables

### Backend Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `PORT` | Server port | No | `3001` |
| `JWT_SECRET` | JWT signing secret | Yes | - |
| `REFRESH_TOKEN_SECRET` | Refresh token secret | Yes | - |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | No | - |
| `RAWG_API_KEY` | RAWG API key | No | - |
| `TWITCH_CLIENT_ID` | Twitch client ID | No | - |
| `TWITCH_CLIENT_SECRET` | Twitch client secret | No | - |
| `FRONTEND_URL` | Frontend URL for CORS | No | `http://localhost:5173` |

### Frontend Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `VITE_API_URL` | Backend API URL | No | `http://localhost:3001` |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth client ID | No | - |

## 🐛 Troubleshooting

### Port Already in Use

**Windows:**
```bash
netstat -ano | findstr :3001
taskkill /F /PID <process_id>
```

**Linux/Mac:**
```bash
lsof -ti:3001 | xargs kill -9
```

### Backend Not Starting

1. Check if port 3001 is available
2. Verify `.env` file exists and has required variables
3. Check Node.js version: `node --version` (should be v18+)
4. Review backend logs for specific errors

### Frontend Not Connecting to Backend

1. Verify backend is running on the correct port
2. Check `VITE_API_URL` in frontend `.env` matches backend URL
3. Verify CORS configuration in backend
4. Check browser console for CORS errors

### API Keys Not Working

1. Verify API keys are correctly set in `.env` files
2. Check for typos or extra spaces
3. Ensure API keys are active and have proper permissions
4. Review server logs for specific error messages

### Authentication Issues

1. Verify `GOOGLE_CLIENT_ID` is set in both frontend and backend
2. Check that Google OAuth is properly configured
3. Ensure authorized JavaScript origins include your frontend URL
4. Check browser console and server logs for errors

For more troubleshooting tips, see:
- [Backend README - Troubleshooting](./backend/README.md#troubleshooting)
- [Frontend README - Troubleshooting](./frontend/README.md#troubleshooting)

## 📚 Additional Documentation

- **[Frontend README](./frontend/README.md)** - Complete frontend documentation
- **[Backend README](./backend/README.md)** - Complete backend documentation
- **[Google Auth Setup](../GOOGLE_AUTH_SETUP.md)** - Google OAuth setup guide (if available)

## 🧪 Testing

### Manual Testing

1. **Health Check**: Visit `http://localhost:3001/health`
2. **Frontend**: Visit `http://localhost:5173`
3. **API Endpoints**: Use Postman, cURL, or browser to test endpoints

### Example API Calls

**Get Trending Games:**
```bash
curl http://localhost:3001/api/games/trending
```

**Health Check:**
```bash
curl http://localhost:3001/health
```

## 🚀 Deployment

### Backend Deployment

1. Set `NODE_ENV=production`
2. Use strong, unique JWT secrets
3. Configure proper CORS origins
4. Set up proper logging
5. Use environment-specific API keys

### Frontend Deployment

1. Build the application: `npm run build`
2. Deploy the `dist/` folder to a static hosting service
3. Update `VITE_API_URL` to point to production backend
4. Configure environment variables in your hosting platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow existing code style
- Write clear commit messages
- Test your changes thoroughly
- Update documentation as needed
- Ensure both frontend and backend work together

## 📄 License

This project is part of Team 05's Gaming Dashboard application.

## 👥 Team

Team 05 - Gaming Dashboard Project

## 📞 Support

For issues or questions:
- Check the [Troubleshooting](#troubleshooting) section
- Review individual README files for detailed documentation
- Create an issue in the project repository

## 🎯 Roadmap

- [ ] User favorites/bookmarks
- [ ] Game reviews and ratings
- [ ] User profiles
- [ ] Social features
- [ ] Mobile app
- [ ] Advanced analytics
- [ ] Game recommendations

---

**Built with ❤️ by Team 05**

For detailed documentation, please refer to:
- [Frontend Documentation](./frontend/README.md)
- [Backend Documentation](./backend/README.md)

