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
