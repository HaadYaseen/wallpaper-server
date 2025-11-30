import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { handleGoogleAuth } from '../utils/googleAuth';
import { logger } from '../utils/logger';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL || 'http://localhost:4000/auth/google/callback';

export function configureGoogleStrategy() {
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    console.warn('Google OAuth credentials not configured. Google sign-in will be disabled.');
    return;
  }

  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: GOOGLE_CALLBACK_URL,
      },
      async (accessToken: string, refreshToken: string, profile: any, done: (error: Error | null, user?: any) => void) => {
        try {
          const { id, displayName, emails, photos } = profile;
          const email = emails?.[0]?.value;

          if (!email) {
            return done(new Error('No email found in Google profile'), undefined);
          }

          const googleUser = {
            googleId: id,
            email,
            name: displayName,
            avatar: photos?.[0]?.value,
          };

          const user = await handleGoogleAuth(googleUser);
          return done(null, user);
        } catch (error) {
          logger.error('Error in Google authentication', { error });
          return done(error as Error | null, undefined);
        }
      }
    )
  );
}

export function initializePassport() {
  configureGoogleStrategy();
}

