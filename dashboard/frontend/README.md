# Gaming Dashboard Frontend

A modern, responsive React application for exploring gaming statistics, trending games, and live Twitch streams. Built with React 19, Vite, and Tailwind CSS.

## 🌐 Live Deployment

**Production URL**: [https://team-05-sand.vercel.app/](https://team-05-sand.vercel.app/)

## 🎮 Features

- **Game Discovery**: Browse trending games, search with advanced filters, and view detailed game information
- **Analytics Dashboard**: Interactive charts for genre distribution, platform statistics, and rating analysis
- **Twitch Integration**: View top live streams and game-specific streams
- **Google OAuth Authentication**: Secure login with Google account
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Real-time Data**: Live updates from RAWG API and Twitch API
- **Advanced Search**: Filter games by genre, platform, rating, and release year
- **Smooth Animations**: Powered by Framer Motion for enhanced user experience

## 🛠️ Tech Stack

- **React 19.2.0** - UI library
- **Vite 7.2.2** - Build tool and dev server
- **React Router DOM 6.22.0** - Client-side routing
- **TanStack React Query 5.17.0** - Server state management
- **Tailwind CSS 3.4.1** - Utility-first CSS framework
- **Framer Motion 11.0.0** - Animation library
- **Chart.js 4.4.0** - Charting library
- **@react-oauth/google 0.12.2** - Google OAuth integration
- **Axios 1.6.2** - HTTP client

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **Backend server** running (see backend README)

## 🚀 Installation

1. **Navigate to the frontend directory:**
   ```bash
   cd dashboard/frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

## ⚙️ Environment Variables

Create a `.env` file in the `frontend` directory:

```env
# Backend API URL (defaults to http://localhost:3001 if not set)
VITE_API_URL=http://localhost:3001

# Google OAuth Client ID (optional - for authentication)
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

### Getting Google OAuth Client ID

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project or select existing one
3. Enable Google Identity Services API
4. Go to "Credentials" → "Create Credentials" → "OAuth client ID"
5. Choose "Web application"
6. Add authorized JavaScript origins:
   - `http://localhost:5173`
   - `http://127.0.0.1:5173`
   - `https://team-05-sand.vercel.app`
7. Copy the Client ID to your `.env` file

> **Note**: If `VITE_GOOGLE_CLIENT_ID` is not provided, the app will work but Google authentication will be disabled.

## 🏃 Running the Application

### Development Mode

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

### Production Build

```bash
npm run build
```

The optimized build will be in the `dist/` directory.

## 🔌 API Integration

The frontend communicates with the backend API. All endpoints are prefixed with `/api/`:

- **Games**: `/api/games/trending`, `/api/games/search`, `/api/games/:id`
- **Analytics**: `/api/genres/stats`, `/api/platforms/stats`
- **Metadata**: `/api/genres`, `/api/platforms`
- **Twitch**: `/api/twitch/streams/top`, `/api/twitch/streams/game/:id`
- **Auth**: `/api/auth/google`, `/api/auth/refresh`, `/api/auth/logout`

## 🐛 Troubleshooting

### Port Already in Use
Vite will automatically use the next available port if 5173 is in use.

### API Connection Issues
- Ensure the backend server is running
- Check `VITE_API_URL` in `.env` matches backend URL
- Verify CORS settings in backend

### Google OAuth Not Working
- Verify `VITE_GOOGLE_CLIENT_ID` is set in `.env`
- Check authorized JavaScript origins in Google Cloud Console
- Wait 5 minutes after configuration changes

### Build Errors
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf node_modules/.vite`
- Check Node.js version compatibility

## 📄 License

This project is part of Team 05's Gaming Dashboard application.

---

**Built with ❤️ using React, Vite, and Tailwind CSS**
