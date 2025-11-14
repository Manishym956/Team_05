import { GoogleLogin } from '@react-oauth/google';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Loader2 } from 'lucide-react';
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
    <div className="flex flex-col items-center gap-4 w-full">
      {/* Loading Overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center gap-2 py-3 px-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-800"
          >
            <Loader2 className="w-5 h-5 text-purple-600 dark:text-purple-400 animate-spin" />
            <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
              Signing you in...
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Google Login Button */}
      {!isLoading && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full flex justify-center"
        >
          <div className="transform transition-transform hover:scale-105">
            <GoogleLogin
              onSuccess={handleSuccess}
              onError={handleError}
              disabled={isLoading}
              theme="outline"
              size="large"
              text="continue_with"
              shape="rectangular"
            />
          </div>
        </motion.div>
      )}

      {/* Error Message */}
      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="w-full flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl"
          >
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800 dark:text-red-300 mb-1">
                Authentication Error
              </p>
              <p className="text-xs text-red-700 dark:text-red-400">
                {errorMessage}
              </p>
            </div>
            <button
              onClick={() => setErrorMessage('')}
              className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GoogleLoginButton;
