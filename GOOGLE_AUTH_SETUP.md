# Google OAuth Setup Guide

## Issues Fixed:
1. ✅ Chart.js Filler plugin registered
2. ✅ Auth routes registered in backend (`/api/auth/*`)
3. ✅ Missing packages installed (google-auth-library, jsonwebtoken)
4. ✅ CORS configured properly
5. ✅ Frontend API paths corrected

## To Fix Google OAuth 403 Error:

The error "The given origin is not allowed for the given client ID" means you need to configure your Google OAuth credentials properly.

### Step 1: Get Google OAuth Client ID

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable "Google+ API" or "Google Identity Services"
4. Go to "Credentials" → "Create Credentials" → "OAuth client ID"
5. Choose "Web application"
6. **IMPORTANT**: Add these to "Authorized JavaScript origins":
   - `http://localhost:5173`
   - `http://127.0.0.1:5173`
   - (Add your production domain when deploying)
7. Copy the Client ID

### Step 2: Configure Environment Variables

**Frontend** (`dashboard/frontend/.env`):
```
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

**Backend** (`dashboard/backend/.env`):
```
GOOGLE_CLIENT_ID=your_google_client_id_here
JWT_SECRET=your_jwt_secret_here
REFRESH_TOKEN_SECRET=your_refresh_token_secret_here
```

### Step 3: Restart Servers

After adding environment variables, restart both frontend and backend servers.

## Current Status:

- ✅ Backend auth routes are registered at `/api/auth/*`
- ✅ Frontend calls corrected to use `/api/auth/*`
- ✅ Google OAuth provider conditionally loaded
- ✅ Error handling improved
- ✅ CORS configured for development

The 403 error will be resolved once you:
1. Add `http://localhost:5173` to Google Cloud Console authorized origins
2. Set the same Client ID in both frontend and backend `.env` files

