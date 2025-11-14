import express from 'express';
import { verifyGoogleToken } from '../auth/googleAuth.js';
import { generateTokens, refreshAccessToken } from '../auth/jwtUtils.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import winston from 'winston';

const router = express.Router();

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

// POST /auth/google - Verify Google token and issue JWT
router.post('/google', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Google token is required' });
    }

    // Verify Google token
    const googleUser = await verifyGoogleToken(token);

    // Generate our JWT tokens
    const { accessToken, refreshToken } = generateTokens(
      googleUser.userId,
      googleUser.email,
      googleUser.name
    );

    logger.info(`User authenticated: ${googleUser.email}`);

    res.json({
      success: true,
      user: {
        id: googleUser.userId,
        email: googleUser.email,
        name: googleUser.name,
        picture: googleUser.picture,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    logger.error('Google auth error:', error.message);
    res.status(401).json({ error: error.message });
  }
});

// POST /auth/refresh - Refresh access token
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token is required' });
    }

    const newAccessToken = await refreshAccessToken(refreshToken);

    res.json({
      success: true,
      accessToken: newAccessToken,
    });
  } catch (error) {
    logger.error('Token refresh error:', error.message);
    res.status(401).json({ error: 'Invalid refresh token' });
  }
});

// GET /auth/verify - Verify current session
router.get('/verify', authMiddleware, (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

// POST /auth/logout - Logout (client-side token deletion)
router.post('/logout', authMiddleware, (req, res) => {
  logger.info(`User logged out: ${req.user.email}`);
  res.json({
    success: true,
    message: 'Logged out successfully',
  });
});

export default router;
