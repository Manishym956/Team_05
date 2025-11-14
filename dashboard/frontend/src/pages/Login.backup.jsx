import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GoogleLoginButton from '../components/Auth/GoogleLoginButton';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      // Redirect to the page they were trying to access, or home if none
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">GhostMetrics</h1>
          <p className="text-gray-600">Gaming Stats Dashboard</p>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
          <p className="text-sm text-gray-700">
            Sign in with your Google account to access the gaming dashboard and track your favorite games and streams.
          </p>
        </div>

        <div className="mb-6">
          <GoogleLoginButton />
        </div>

        <div className="text-center text-sm text-gray-500 border-t pt-4">
          <p>Your data is secure and we only access your basic profile information.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
