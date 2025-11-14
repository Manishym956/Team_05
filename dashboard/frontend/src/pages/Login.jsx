import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, TrendingUp, Gamepad2 } from 'lucide-react';
import GoogleLoginButton from '../components/Auth/GoogleLoginButton';
import AnimatedBackground from '../components/UI/AnimatedBackground';
import { useAuth } from '../context/AuthContext';
import dragonLogo from '../assets/dragon-logo.png';

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

  const features = [
    { icon: TrendingUp, text: 'Track Gaming Trends' },
    { icon: Gamepad2, text: 'Discover New Games' },
    { icon: Shield, text: 'Secure & Private' },
  ];

  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-br from-white via-purple-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 transition-colors duration-500 px-2 sm:px-6 py-6 relative overflow-hidden">
      {/* Animated Background */}
      <AnimatedBackground intensity="medium" speed="normal" />
      
      {/* Content */}
      <div className="relative z-10 flex items-center justify-center flex-1 min-h-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Main Card */}
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-gray-200/50 dark:border-gray-700/50">
            {/* Header Section */}
            <div className="relative bg-gradient-to-br from-purple-600 via-pink-600 to-indigo-600 p-6 sm:p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="flex items-center justify-center mb-4"
              >
                <img
                  src={dragonLogo}
                  alt="GhostMetrics Logo"
                  className="w-16 h-16 rounded-xl shadow-lg"
                />
              </motion.div>
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-3xl sm:text-4xl font-extrabold text-white mb-2 bg-gradient-to-r from-white to-white/90 bg-clip-text text-transparent"
              >
                GhostMetrics
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-white/90 text-sm font-medium italic"
              >
                Gaming Analytics Platform
              </motion.p>
            </div>

            {/* Content Section */}
            <div className="p-6 sm:p-8">
              {/* Welcome Message */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-center mb-6 sm:mb-8"
              >
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Welcome Back!
                </h2>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                  Sign in to access your gaming dashboard
                </p>
              </motion.div>

              {/* Features Grid */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="grid grid-cols-3 gap-2 sm:gap-3 mb-6 sm:mb-8"
              >
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className="flex flex-col items-center p-2 sm:p-3 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-100 dark:border-purple-800/30"
                  >
                    <feature.icon className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 dark:text-purple-400 mb-1 sm:mb-2" />
                    <span className="text-xs text-gray-700 dark:text-gray-300 text-center font-medium leading-tight">
                      {feature.text}
                    </span>
                  </motion.div>
                ))}
              </motion.div>

              {/* Google Login Button */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
                className="mb-4 sm:mb-6"
              >
                <GoogleLoginButton />
              </motion.div>

              {/* Security Notice */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="flex items-start space-x-2 sm:space-x-3 p-3 sm:p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700"
              >
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 font-medium mb-1">
                    Secure Authentication
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    We only access your basic profile information. Your data is encrypted and secure.
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="px-6 sm:px-8 py-3 sm:py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700"
            >
              <p className="text-center text-xs text-gray-500 dark:text-gray-400">
                By signing in, you agree to our Terms of Service and Privacy Policy
              </p>
            </motion.div>
          </div>

          {/* Additional Info */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="text-center text-gray-600 dark:text-gray-400 text-sm mt-4 sm:mt-6"
          >
            New to GhostMetrics? Explore our{' '}
            <button
              onClick={() => navigate('/')}
              className="font-semibold text-purple-600 dark:text-purple-400 underline hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
            >
              public dashboard
            </button>
          </motion.p>
        </motion.div>
      </div>
    </main>
  );
};

export default Login;

