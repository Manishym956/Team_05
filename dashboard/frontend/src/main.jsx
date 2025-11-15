import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import { DashboardProvider } from './context/DashboardContext'
import App from './App.jsx'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        // Don't retry on 503 (service unavailable) errors
        if (error?.response?.status === 503) return false;
        return failureCount < 1;
      },
      staleTime: 30000,
    },
  },
})

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

// Debug logging for Google OAuth setup
if (GOOGLE_CLIENT_ID) {
  console.log('🔐 Google OAuth Configuration:');
  console.log('  Client ID:', GOOGLE_CLIENT_ID.substring(0, 20) + '...');
  console.log('  Current Origin:', window.location.origin);
  console.log('  ⚠️  Add these EXACT origins to Google Cloud Console:');
  console.log('    - http://localhost:5173');
  console.log('    - http://127.0.0.1:5173');
  console.log('    - http://localhost:3000');
  console.log('    - http://127.0.0.1:3000');
  console.log('  📝 Path: APIs & Services → Credentials → Edit OAuth Client');
} else {
  console.warn('⚠️  VITE_GOOGLE_CLIENT_ID is not set in environment variables');
  console.warn('  Create dashboard/frontend/.env with:');
  console.warn('  VITE_GOOGLE_CLIENT_ID=your_client_id_here');
}

// Only wrap with GoogleOAuthProvider if client ID is provided
const AppWrapper = ({ children }) => {
  if (GOOGLE_CLIENT_ID) {
    return (
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        {children}
      </GoogleOAuthProvider>
    );
  }
  return <>{children}</>;
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <AppWrapper>
          <ThemeProvider>
            <AuthProvider>
              <DashboardProvider>
                <App />
              </DashboardProvider>
            </AuthProvider>
          </ThemeProvider>
        </AppWrapper>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
)
