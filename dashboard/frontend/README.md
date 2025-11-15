# Gaming Dashboard Frontend

A modern, responsive React application for exploring gaming statistics, trending games, and live Twitch streams. Built with React 19, Vite, and Tailwind CSS.

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

### Core
- **React 19.2.0** - UI library
- **Vite 7.2.2** - Build tool and dev server
- **React Router DOM 6.22.0** - Client-side routing

### State Management & Data Fetching
- **TanStack React Query 5.17.0** - Server state management and caching
- **React Context API** - Client state management (Auth, Theme, Dashboard)

### UI & Styling
- **Tailwind CSS 3.4.1** - Utility-first CSS framework
- **Framer Motion 11.0.0** - Animation library
- **Lucide React 0.468.0** - Icon library
- **Chart.js 4.4.0** - Charting library
- **React Chart.js 2 5.2.0** - React wrapper for Chart.js

### Authentication
- **@react-oauth/google 0.12.2** - Google OAuth integration

### HTTP Client
- **Axios 1.6.2** - HTTP client for API requests

### Development Tools
- **ESLint 9.39.1** - Code linting
- **PostCSS 8.4.33** - CSS processing
- **Autoprefixer 10.4.17** - CSS vendor prefixing

## 📁 Project Structure

```
frontend/
├── public/
│   └── vite.svg              # Vite logo
├── src/
│   ├── assets/               # Static assets
│   │   ├── dragon-logo.png   # App logo
│   │   └── react.svg
│   ├── components/           # React components
│   │   ├── Auth/            # Authentication components
│   │   │   ├── GoogleLoginButton.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── Charts/          # Chart components
│   │   │   ├── GenreChart.jsx
│   │   │   ├── PlatformChart.jsx
│   │   │   └── RatingChart.jsx
│   │   ├── Filters/         # Filter components
│   │   │   └── GameFilters.jsx
│   │   ├── Games/           # Game-related components
│   │   │   ├── GameCard.jsx
│   │   │   ├── GameDetails.jsx
│   │   │   └── GameList.jsx
│   │   ├── Layout/          # Layout components
│   │   │   └── Header.jsx
│   │   ├── Search/          # Search components
│   │   │   └── SearchModal.jsx
│   │   ├── Twitch/          # Twitch stream components
│   │   │   ├── StreamCard.jsx
│   │   │   └── StreamList.jsx
│   │   └── UI/              # Reusable UI components
│   │       ├── AnimatedBackground.jsx
│   │       └── LoadingSkeleton.jsx
│   ├── context/             # React Context providers
│   │   ├── AuthContext.jsx  # Authentication state
│   │   ├── DashboardContext.jsx  # Dashboard state
│   │   └── ThemeContext.jsx # Theme state
│   ├── hooks/               # Custom React hooks
│   │   └── useAuth.js
│   ├── pages/               # Page components
│   │   ├── Dashboard.jsx    # Main dashboard page
│   │   └── Login.jsx        # Login page
│   ├── services/            # API services
│   │   └── api.js           # API client and endpoints
│   ├── App.jsx              # Main App component
│   ├── App.css              # App styles
│   ├── main.jsx             # Application entry point
│   └── index.css            # Global styles
├── .env                     # Environment variables (create this)
├── eslint.config.js         # ESLint configuration
├── index.html               # HTML template
├── package.json             # Dependencies and scripts
├── postcss.config.js        # PostCSS configuration
├── tailwind.config.js       # Tailwind CSS configuration
└── vite.config.js           # Vite configuration
```

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher recommended)
- **npm** (v9 or higher) or **yarn**
- **Backend server** running (see backend README for setup)

## 🚀 Installation

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

## ⚙️ Environment Variables

Create a `.env` file in the `frontend` directory with the following variables:

```env
# Backend API URL
VITE_API_URL=http://localhost:3001

# Google OAuth Client ID (optional, for authentication)
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

### Getting a Google OAuth Client ID

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth client ID"
5. Choose "Web application"
6. Add authorized JavaScript origins: `http://localhost:5173`
7. Copy the Client ID to your `.env` file

> **Note**: If `VITE_GOOGLE_CLIENT_ID` is not provided, the app will still work but Google authentication will be disabled.

## 🏃 Running the Application

### Development Mode

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the next available port).

### Production Build

Build the application for production:

```bash
npm run build
```

The optimized build will be in the `dist/` directory.

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

## 🧪 Linting

Run ESLint to check for code quality issues:

```bash
npm run lint
```

## 🎨 Key Features Explained

### Authentication
- Google OAuth integration for secure login
- JWT token management with refresh tokens
- Protected routes for authenticated users
- Persistent session using localStorage

### Data Fetching
- React Query for efficient data fetching and caching
- Automatic refetching and error handling
- Optimistic updates for better UX
- Request deduplication

### Theme System
- Light and dark mode support
- Theme preference persistence
- Smooth theme transitions
- Custom color palette

### Charts & Analytics
- Interactive genre distribution chart
- Platform statistics visualization
- Rating analysis with Chart.js
- Responsive chart layouts

### Search & Filters
- Real-time game search
- Advanced filtering by:
  - Genre
  - Platform
  - Rating
  - Release year
- Search modal with keyboard shortcuts

## 🔌 API Integration

The frontend communicates with the backend API through the `api.js` service file. The following endpoints are used:

### Games API
- `GET /api/games/trending` - Get trending games
- `GET /api/games/search` - Search games with filters
- `GET /api/games/:id` - Get game details

### Analytics API
- `GET /api/genres/stats` - Get genre statistics
- `GET /api/platforms/stats` - Get platform statistics

### Metadata API
- `GET /api/genres` - Get all genres
- `GET /api/platforms` - Get all platforms

### Twitch API
- `GET /api/twitch/streams/top` - Get top Twitch streams
- `GET /api/twitch/streams/game/:id` - Get streams for a specific game

### Auth API
- `POST /api/auth/google` - Authenticate with Google
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user

## 🎯 Component Architecture

### Context Providers
- **AuthProvider**: Manages authentication state and user session
- **ThemeProvider**: Handles theme switching and persistence
- **DashboardProvider**: Manages dashboard-specific state

### Custom Hooks
- **useAuth**: Access authentication context and methods

### Page Components
- **Dashboard**: Main dashboard with games, charts, and streams
- **Login**: Authentication page with Google OAuth

### Reusable Components
- **GameCard**: Display game information in a card format
- **GameList**: Render a list of games
- **GameDetails**: Detailed game information page
- **SearchModal**: Modal for searching games
- **StreamCard**: Display Twitch stream information
- **Charts**: Various chart components for analytics

## 🎨 Styling Guidelines

- **Tailwind CSS** is used for all styling
- Custom color palette defined in `tailwind.config.js`
- Dark mode support via `class` strategy
- Custom animations and transitions
- Responsive design with mobile-first approach

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🐛 Troubleshooting

### Port Already in Use
If port 5173 is already in use, Vite will automatically use the next available port.

### API Connection Issues
- Ensure the backend server is running on the port specified in `VITE_API_URL`
- Check CORS settings in the backend
- Verify environment variables are set correctly

### Google OAuth Not Working
- Verify `VITE_GOOGLE_CLIENT_ID` is set in `.env`
- Check that the authorized JavaScript origin matches your dev server URL
- Ensure Google+ API is enabled in Google Cloud Console

### Build Errors
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf node_modules/.vite`
- Check Node.js version compatibility

## 📝 Development Guidelines

1. **Component Structure**: Keep components small and focused
2. **State Management**: Use React Query for server state, Context for client state
3. **Styling**: Prefer Tailwind utility classes over custom CSS
4. **Error Handling**: Always handle errors gracefully with user-friendly messages
5. **Loading States**: Show loading indicators for async operations
6. **Accessibility**: Use semantic HTML and ARIA attributes where needed

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

**Built with ❤️ using React, Vite, and Tailwind CSS**
