# Google OAuth Setup Guide - Fix 403 Origin Error

## Your Configuration

- **Google Client ID**: `410543748382-b75fpb9psubk8pmj14aa363gr52drnt7.apps.googleusercontent.com`
- **Frontend URL**: `http://localhost:5173`
- **Backend URL**: `http://localhost:3001`

## Step 1: Add Authorized Origins in Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (or create one if needed)
3. Navigate to: **APIs & Services** → **Credentials**
4. Find your OAuth 2.0 Client ID: `410543748382-b75fpb9psubk8pmj14aa363gr52drnt7`
5. Click **Edit** (pencil icon)
6. Under **Authorized JavaScript origins**, add these EXACT URLs (click + ADD URI for each):
   ```
   http://localhost:5173
   http://127.0.0.1:5173
   http://localhost:3000
   http://127.0.0.1:3000
   ```
7. Under **Authorized redirect URIs** (if needed), add:
   ```
   http://localhost:5173
   http://127.0.0.1:5173
   ```
8. Click **Save**

## Step 2: Configure Environment Variables

### Frontend (`dashboard/frontend/.env`)
Create or update the `.env` file with:
```env
VITE_GOOGLE_CLIENT_ID=410543748382-b75fpb9psubk8pmj14aa363gr52drnt7.apps.googleusercontent.com
```

### Backend (`dashboard/backend/.env`)
Create or update the `.env` file with:
```env
GOOGLE_CLIENT_ID=410543748382-b75fpb9psubk8pmj14aa363gr52drnt7.apps.googleusercontent.com
JWT_SECRET=your_jwt_secret_here
REFRESH_TOKEN_SECRET=your_refresh_token_secret_here
```

## Step 3: Restart Servers

After updating environment variables:
1. Stop both frontend and backend servers (Ctrl+C)
2. Restart frontend: `cd dashboard/frontend && npm run dev`
3. Restart backend: `cd dashboard/backend && npm start`

**Important**: After adding origins to Google Cloud Console, wait 5 minutes before testing!

## Step 4: Verify Setup

1. Open browser console (F12)
2. Look for these debug messages:
   ```
   🔐 Google OAuth Configuration:
     Client ID: 410543748382-b...
     Current Origin: http://localhost:5173
   ```
3. Try logging in with Google
4. Check console for any errors

## Common Issues

### Issue: "The given origin is not allowed"
**Solution**: 
- Double-check that origins are EXACTLY as shown (no trailing slash, correct port)
- **Wait 5 minutes** after saving in Google Cloud Console (propagation delay)
- Clear browser cache (Ctrl+Shift+Delete) and hard refresh (Ctrl+Shift+R)
- Verify all 4 origins are added: localhost:5173, 127.0.0.1:5173, localhost:3000, 127.0.0.1:3000

### Issue: Client ID not found
**Solution**:
- Verify `.env` file exists in `dashboard/frontend/`
- Ensure variable name is `VITE_GOOGLE_CLIENT_ID` (not `REACT_APP_GOOGLE_CLIENT_ID`)
- Restart the dev server after adding `.env` file

### Issue: Popup blocked
**Solution**:
- Allow popups for `localhost:5173` in browser settings
- Try a different browser to test

## Debug Checklist

- [ ] All 4 origins added to Google Cloud Console authorized origins
- [ ] Changes saved in Google Cloud Console
- [ ] Waited 5 minutes for Google's changes to propagate
- [ ] `.env` file created in `dashboard/frontend/` with `VITE_GOOGLE_CLIENT_ID`
- [ ] `.env` file created in `dashboard/backend/` with `GOOGLE_CLIENT_ID`
- [ ] Both servers restarted after adding environment variables
- [ ] Browser cache cleared and page hard refreshed
- [ ] Browser console shows debug messages with correct origin
- [ ] No CORS errors in browser console
- [ ] Google Sign-In button appears and is clickable

## Testing

1. Navigate to `http://localhost:5173/login`
2. Click the Google Sign-In button
3. Should open Google OAuth popup
4. After authentication, should redirect to dashboard

## Need Help?

Check browser console for:
- Origin mismatch errors
- Client ID configuration errors
- Network errors (CORS, 403, etc.)

All errors are now logged with detailed information to help debug.

