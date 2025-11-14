import { OAuth2Client } from 'google-auth-library';
import winston from 'winston';

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

let client = null;
let GOOGLE_CLIENT_ID = null;

export const initializeGoogleAuth = () => {
  // Read the environment variable inside the function, after dotenv.config() has run
  GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
  
  if (!GOOGLE_CLIENT_ID) {
    logger.warn('⚠️  GOOGLE_CLIENT_ID is not configured. Google Auth will not work.');
    return;
  }
  
  client = new OAuth2Client(GOOGLE_CLIENT_ID);
  logger.info('✅ Google Auth initialized');
};

export const verifyGoogleToken = async (token) => {
  if (!client) {
    throw new Error('Google Auth not initialized. Please configure GOOGLE_CLIENT_ID');
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    
    return {
      userId: payload.sub,
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
      emailVerified: payload.email_verified,
    };
  } catch (error) {
    logger.error('Error verifying Google token:', error.message);
    throw new Error('Invalid Google token');
  }
};
