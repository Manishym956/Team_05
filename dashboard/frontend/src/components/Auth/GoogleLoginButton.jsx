import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';

const GoogleLoginButton = () => {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const handleSuccess = async (credentialResponse) => {
    try {
      setIsLoading(true);
      setErrorMessage('');
      
      console.log('✅ Google login initiated...');
      console.log('  Origin:', window.location.origin);
      console.log('  Token received:', credentialResponse.credential?.substring(0, 50) + '...');
      
      const success = await login(credentialResponse.credential);
      
      console.log('  Login response:', { success });
      
      if (!success) {
        setErrorMessage('Login failed. Please try again later.');
        console.error('❌ Login returned false');
      }
      // Note: Navigation is handled by Login.jsx useEffect watching isAuthenticated
    } catch (error) {
      console.error('❌ Login error:', error);
      console.error('  Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      setErrorMessage(error.message || 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleError = (error) => {
    console.error('❌ Google OAuth Error:', error);
    console.error('  Error Type:', error?.type);
    console.error('  Error Details:', error);
    console.error('  Current Origin:', window.location.origin);
    console.error('  Client ID:', clientId ? clientId.substring(0, 20) + '...' : 'Not set');
    
    if (error?.type === 'popup_closed_by_user') {
      setErrorMessage('Login cancelled. Please try again.');
    } else if (error?.error === 'popup_blocked') {
      setErrorMessage('Popup was blocked. Please allow popups for this site.');
    } else if (error?.error === 'access_denied') {
      setErrorMessage('Access denied. Please try again.');
    } else {
      // Check for 403 origin error
      const errorMessage = error?.error || error?.message || '';
      if (errorMessage.includes('origin') || errorMessage.includes('403')) {
        setErrorMessage(
          'Origin not allowed. Please add http://localhost:5173 to authorized origins in Google Cloud Console.'
        );
      } else {
        setErrorMessage('Google login failed. Please check your Google OAuth configuration.');
      }
    }
  };

  // Show message if client ID is not configured
  if (!clientId) {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="w-full p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
          <p className="text-sm text-yellow-800 dark:text-yellow-200 text-center mb-2">
            Google OAuth is not configured
          </p>
          <p className="text-xs text-yellow-700 dark:text-yellow-300 text-center">
            Please add VITE_GOOGLE_CLIENT_ID to your .env file
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex justify-center">
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={handleError}
          disabled={isLoading}
          theme="outline"
          size="large"
          text="signin_with"
          shape="rectangular"
          logo_alignment="left"
        />
      </div>
      {errorMessage && (
        <div className="text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-lg border border-red-200 dark:border-red-800">
          {errorMessage}
        </div>
      )}
    </div>
  );
};

export default GoogleLoginButton;
