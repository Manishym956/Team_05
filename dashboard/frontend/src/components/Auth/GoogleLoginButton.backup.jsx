import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';

const GoogleLoginButton = () => {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSuccess = async (credentialResponse) => {
    try {
      setIsLoading(true);
      setErrorMessage('');
      
      console.log('Google login initiated...');
      console.log('Token received:', credentialResponse.credential?.substring(0, 50) + '...');
      
      const success = await login(credentialResponse.credential);
      
      console.log('Login response:', { success });
      
      if (!success) {
        setErrorMessage('Login failed. Please try again.');
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

  const handleError = () => {
    console.error('Google login error');
    setErrorMessage('Google login failed. Please try again.');
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex justify-center">
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={handleError}
          disabled={isLoading}
        />
      </div>
      {errorMessage && (
        <div className="text-red-600 text-sm bg-red-50 px-4 py-2 rounded-lg">
          {errorMessage}
        </div>
      )}
    </div>
  );
};

export default GoogleLoginButton;
