import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { prisma } from '../utils/context';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL || 'http://localhost:4000/auth/google/callback';

/**
 * Configure Google OAuth strategy
 */
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

          // Find or create user
          let user = await prisma.user.findUnique({
            where: { googleId: id },
          });

          if (user) {
            // Update last login
            user = await prisma.user.update({
              where: { id: user.id },
              data: { lastLogin: new Date() },
            });
          } else {
            // Check if user exists with this email
            const existingUser = await prisma.user.findUnique({
              where: { email },
            });

            if (existingUser) {
              // Link Google account
              user = await prisma.user.update({
                where: { id: existingUser.id },
                data: {
                  googleId: id,
                  avatar: photos?.[0]?.value || existingUser.avatar,
                },
              });
            } else {
              // Create new user
              const baseUsername = displayName.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 20);
              let username = baseUsername;
              let counter = 1;

              while (await prisma.user.findUnique({ where: { username } })) {
                username = `${baseUsername}${counter}`;
                counter++;
              }

              user = await prisma.user.create({
                data: {
                  email,
                  name: displayName,
                  username,
                  googleId: id,
                  avatar: photos?.[0]?.value,
                  isVerified: true,
                  password: '',
                },
              });
            }
          }

          return done(null, user);
        } catch (error) {
          return done(error as Error | null, undefined);
        }
      }
    )
  );
}

/**
 * Initialize passport
 */
export function initializePassport() {
  configureGoogleStrategy();
}

