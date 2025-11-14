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
      
      console.log('Google login initiated...');
      console.log('Token received:', credentialResponse.credential?.substring(0, 50) + '...');
      
      const success = await login(credentialResponse.credential);
      
      console.log('Login response:', { success });
      
      if (!success) {
        setErrorMessage('Login failed. Please try again later.');
        console.error('Login returned false');
      }
      // Note: Navigation is handled by Login.jsx useEffect watching isAuthenticated
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage(error.message || 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleError = (error) => {
    console.error('Google login error:', error);
    if (error?.type === 'popup_closed_by_user') {
      setErrorMessage('Login cancelled. Please try again.');
    } else {
      setErrorMessage('Google login failed. Please check your Google OAuth configuration.');
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
