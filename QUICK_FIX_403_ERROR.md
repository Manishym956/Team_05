# Quick Fix: Google OAuth 403 Origin Error

## Immediate Action Required

### 1. Add Origins to Google Cloud Console (2 minutes)

1. Visit: https://console.cloud.google.com/apis/credentials
2. Click on your OAuth Client ID: `410543748382-b75fpb9psubk8pmj14aa363gr52drnt7`
3. Click **Edit** (pencil icon)
4. Under **Authorized JavaScript origins**, click **+ ADD URI** and add these EXACT URLs (one at a time):
   - `http://localhost:5173`
   - `http://127.0.0.1:5173`
   - `http://localhost:3000`
   - `http://127.0.0.1:3000`
5. Click **SAVE**
6. **Wait 5 minutes** for Google's changes to propagate (important!)

### 2. Verify Environment Variable (1 minute)

Check if `dashboard/frontend/.env` exists and contains:
```env
VITE_GOOGLE_CLIENT_ID=410543748382-b75fpb9psubk8pmj14aa363gr52drnt7.apps.googleusercontent.com
```

If the file doesn't exist, create it in `dashboard/frontend/` directory.

### 3. Restart Frontend Server

```bash
cd dashboard/frontend
# Stop current server (Ctrl+C)
npm run dev
```

### 4. Check Browser Console

Open browser console (F12) and look for:
```
🔐 Google OAuth Configuration:
  Client ID: 410543748382-b...
  Current Origin: http://localhost:5173
```

If you see this, the client ID is loaded correctly.

## Code Locations

### Where Google OAuth is Initialized
- **File**: `dashboard/frontend/src/main.jsx`
- **Line**: 26-50
- **Variable**: `VITE_GOOGLE_CLIENT_ID`

### Where Google Sign-In Button is Used
- **File**: `dashboard/frontend/src/components/Auth/GoogleLoginButton.jsx`
- **Component**: `<GoogleLogin>` from `@react-oauth/google`
- **Used in**: `dashboard/frontend/src/pages/Login.jsx`

### Where Authentication is Handled
- **File**: `dashboard/frontend/src/context/AuthContext.jsx`
- **Function**: `login()` - sends token to backend `/api/auth/google`

## Debugging

The code now includes extensive logging. Check browser console for:
- ✅ Success messages with origin info
- ❌ Error messages with detailed error types
- 🔐 Configuration messages on page load

## Common Mistakes

1. **Trailing slash**: Use `http://localhost:5173` NOT `http://localhost:5173/`
2. **Wrong variable name**: Must be `VITE_GOOGLE_CLIENT_ID` (not `REACT_APP_...`)
3. **Not restarting server**: Must restart after adding `.env` file
4. **Wrong origin**: Must match exactly what's in browser address bar

## Test After Fix

1. **Wait 5 minutes** after saving in Google Cloud Console
2. **Clear browser cache** (Ctrl+Shift+Delete or Cmd+Shift+Delete on Mac)
3. **Hard refresh** the page (Ctrl+Shift+R or Cmd+Shift+R)
4. Navigate to `http://localhost:5173/login`
5. Open browser console (F12) to see debug messages
6. Click Google Sign-In button
7. Should open Google OAuth popup (not show 403 error)

## ✅ Checklist

- [ ] Added all 4 origins to Google Cloud Console
- [ ] Saved changes in Google Cloud Console
- [ ] Waited 5 minutes for propagation
- [ ] Verified `.env` file exists with `VITE_GOOGLE_CLIENT_ID`
- [ ] Restarted frontend dev server
- [ ] Cleared browser cache
- [ ] Hard refreshed the page
- [ ] Checked browser console for debug messages
- [ ] Tested Google Sign-In button

