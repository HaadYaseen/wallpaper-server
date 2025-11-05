import { User } from '@prisma/client';
import { GraphQLError } from 'graphql';
import { OAuth2Client } from 'google-auth-library';
import { Resolvers, SignUpInput, LoginInput, GoogleAuthInput } from '../types';
import {
  hashPassword,
  verifyPassword,
  generateTokens,
  createSession,
  revokeSession,
  revokeAllUserSessions,
  verifyRefreshToken,
} from '../../utils/auth';
import { requireAuth } from '../../utils/rbac';
import { GraphQLContext, prisma } from '../../utils/context';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

const googleClient = GOOGLE_CLIENT_ID
  ? new OAuth2Client(GOOGLE_CLIENT_ID)
  : null;

/**
 * Verify Google ID token and get user info
 */
async function verifyGoogleToken(idToken: string): Promise<{
  googleId: string;
  email: string;
  name: string;
  avatar?: string;
}> {
  if (!googleClient) {
    throw new GraphQLError('Google OAuth is not configured', {
      extensions: { code: 'BAD_USER_INPUT' },
    });
  }

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: GOOGLE_CLIENT_ID!,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      throw new GraphQLError('Invalid Google token', {
        extensions: { code: 'UNAUTHENTICATED' },
      });
    }

    return {
      googleId: payload.sub,
      email: payload.email!,
      name: payload.name || payload.email!.split('@')[0],
      avatar: payload.picture,
    };
  } catch (error) {
    throw new GraphQLError('Invalid or expired Google token', {
      extensions: { code: 'UNAUTHENTICATED' },
    });
  }
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: string;
  refreshTokenExpiresAt: string;
}

/**
 * Generate a unique username from email if username is taken
 */
async function generateUniqueUsername(baseUsername: string): Promise<string> {
  let username = baseUsername.toLowerCase().replace(/[^a-z0-9]/g, '');
  let counter = 1;
  let finalUsername = username;

  while (await prisma.user.findUnique({ where: { username: finalUsername } })) {
    finalUsername = `${username}${counter}`;
    counter++;
  }

  return finalUsername;
}

/**
 * Signup with email and password (local account creation)
 */
async function signup(
  _parent: unknown,
  args: { input: SignUpInput },
  context: GraphQLContext
): Promise<AuthResponse> {
  const { email, password, name, username, avatar } = args.input;

  // Validate input
  if (!email || !password || !name || !username) {
    throw new GraphQLError('All fields are required', {
      extensions: { code: 'BAD_USER_INPUT' },
    });
  }

  if (password.length < 8) {
    throw new GraphQLError('Password must be at least 8 characters', {
      extensions: { code: 'BAD_USER_INPUT' },
    });
  }

  // Check if user already exists
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { username }],
    },
  });

  if (existingUser) {
    throw new GraphQLError('User with this email or username already exists', {
      extensions: { code: 'BAD_USER_INPUT' },
    });
  }

  // Generate unique username if needed
  const uniqueUsername = await generateUniqueUsername(username);

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      username: uniqueUsername,
      avatar: avatar || null,
      isVerified: false, // Email verification required for local accounts
    },
  });

  // Generate tokens
  const tokens = generateTokens(user);

  // Create session
  const deviceInfo = context.req.headers['user-agent'] || undefined;
  const ipAddress = context.req.ip || context.req.socket.remoteAddress || undefined;
  await createSession(user.id, tokens, deviceInfo, ipAddress);

  // Update last login
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLogin: new Date() },
  });

  return {
    user,
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    accessTokenExpiresAt: tokens.accessTokenExpiresAt.toISOString(),
    refreshTokenExpiresAt: tokens.refreshTokenExpiresAt.toISOString(),
  };
}

/**
 * Login with email and password
 */
async function login(
  _parent: unknown,
  args: { input: LoginInput },
  context: GraphQLContext
): Promise<AuthResponse> {
  const { email, password } = args.input;

  if (!email || !password) {
    throw new GraphQLError('Email and password are required', {
      extensions: { code: 'BAD_USER_INPUT' },
    });
  }

  // Find user
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new GraphQLError('Invalid email or password', {
      extensions: { code: 'UNAUTHENTICATED' },
    });
  }

  // Check if user has a password (OAuth users don't have passwords)
  if (!user.password) {
    throw new GraphQLError('Please sign in with Google', {
      extensions: { code: 'UNAUTHENTICATED' },
    });
  }

  // Verify password
  const isValidPassword = await verifyPassword(password, user.password);
  if (!isValidPassword) {
    throw new GraphQLError('Invalid email or password', {
      extensions: { code: 'UNAUTHENTICATED' },
    });
  }

  // Check if user is active
  if (!user.isActive) {
    throw new GraphQLError('Account is inactive', {
      extensions: { code: 'FORBIDDEN' },
    });
  }

  if (user.isBanned) {
    throw new GraphQLError('Account is banned', {
      extensions: { code: 'FORBIDDEN' },
    });
  }

  // Generate tokens
  const tokens = generateTokens(user);

  // Create session
  const deviceInfo = context.req.headers['user-agent'] || undefined;
  const ipAddress = context.req.ip || context.req.socket.remoteAddress || undefined;
  await createSession(user.id, tokens, deviceInfo, ipAddress);

  // Update last login
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLogin: new Date() },
  });

  return {
    user,
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    accessTokenExpiresAt: tokens.accessTokenExpiresAt.toISOString(),
    refreshTokenExpiresAt: tokens.refreshTokenExpiresAt.toISOString(),
  };
}

/**
 * Google OAuth authentication
 * Client only needs to send the ID token from Google
 */
async function googleAuth(
  _parent: unknown,
  args: { input: GoogleAuthInput },
  context: GraphQLContext
): Promise<AuthResponse> {
  const { idToken } = args.input;

  if (!idToken) {
    throw new GraphQLError('Google ID token is required', {
      extensions: { code: 'BAD_USER_INPUT' },
    });
  }

  // Verify the Google ID token and get user info
  const googleUser = await verifyGoogleToken(idToken);
  const { googleId, email, name, avatar } = googleUser;

  // Check if user exists with this Google ID
  let user = await prisma.user.findUnique({
    where: { googleId },
  });

  if (user) {
    // User exists, update last login and avatar if changed
    user = await prisma.user.update({
      where: { id: user.id },
      data: {
        lastLogin: new Date(),
        ...(avatar && { avatar }),
      },
    });
  } else {
    // Check if user exists with this email (account merge scenario)
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      // Link Google account to existing user
      user = await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          googleId,
          avatar: avatar || existingUser.avatar,
          lastLogin: new Date(),
        },
      });
    } else {
      // Create new user - all data comes from verified Google token
      const baseUsername = name.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 20);
      const uniqueUsername = await generateUniqueUsername(baseUsername);

      user = await prisma.user.create({
        data: {
          email,
          name,
          username: uniqueUsername,
          googleId,
          avatar,
          isVerified: true,
          password: null,
        },
      });
    }
  }

  // Check if user is active
  if (!user.isActive) {
    throw new GraphQLError('Account is inactive', {
      extensions: { code: 'FORBIDDEN' },
    });
  }

  if (user.isBanned) {
    throw new GraphQLError('Account is banned', {
      extensions: { code: 'FORBIDDEN' },
    });
  }

  // Generate tokens
  const tokens = generateTokens(user);

  // Create session
  const deviceInfo = context.req.headers['user-agent'] || undefined;
  const ipAddress = context.req.ip || context.req.socket.remoteAddress || undefined;
  await createSession(user.id, tokens, deviceInfo, ipAddress);

  return {
    user,
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    accessTokenExpiresAt: tokens.accessTokenExpiresAt.toISOString(),
    refreshTokenExpiresAt: tokens.refreshTokenExpiresAt.toISOString(),
  };
}

/**
 * Refresh access token using refresh token
 */
async function refreshToken(
  _parent: unknown,
  args: { refreshToken: string },
  context: GraphQLContext
): Promise<AuthResponse> {
  const { refreshToken: token } = args;

  if (!token) {
    throw new GraphQLError('Refresh token is required', {
      extensions: { code: 'BAD_USER_INPUT' },
    });
  }

  // Verify refresh token
  const payload = verifyRefreshToken(token);
  if (!payload) {
    throw new GraphQLError('Invalid refresh token', {
      extensions: { code: 'UNAUTHENTICATED' },
    });
  }

  // Verify session is still active
  const session = await prisma.session.findFirst({
    where: {
      userId: payload.userId,
      refreshToken: token,
      isActive: true,
      refreshTokenExpiresAt: { gt: new Date() },
    },
  });

  if (!session) {
    throw new GraphQLError('Session expired or invalid', {
      extensions: { code: 'UNAUTHENTICATED' },
    });
  }

  // Get user
  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
  });

  if (!user || !user.isActive || user.isBanned) {
    throw new GraphQLError('Account is inactive or banned', {
      extensions: { code: 'FORBIDDEN' },
    });
  }

  // Generate new tokens
  const tokens = generateTokens(user);

  // Update session with new tokens
  await prisma.session.update({
    where: { id: session.id },
    data: {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      accessTokenExpiresAt: tokens.accessTokenExpiresAt,
      refreshTokenExpiresAt: tokens.refreshTokenExpiresAt,
      lastUsedAt: new Date(),
    },
  });

  return {
    user,
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    accessTokenExpiresAt: tokens.accessTokenExpiresAt.toISOString(),
    refreshTokenExpiresAt: tokens.refreshTokenExpiresAt.toISOString(),
  };
}

/**
 * Logout - revoke current session
 */
async function logout(
  _parent: unknown,
  _args: unknown,
  context: GraphQLContext
): Promise<boolean> {
  const user = requireAuth(context.user);

  // Get current session from token
  const authHeader = context.req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const session = await prisma.session.findFirst({
      where: {
        userId: user.id,
        accessToken: token,
        isActive: true,
      },
    });

    if (session) {
      await revokeSession(session.id);
      return true;
    }
  }

  return false;
}

/**
 * Logout from all devices
 */
async function logoutAll(
  _parent: unknown,
  _args: unknown,
  context: GraphQLContext
): Promise<boolean> {
  const user = requireAuth(context.user);
  await revokeAllUserSessions(user.id);
  return true;
}

/**
 * Get current authenticated user
 */
async function me(
  _parent: unknown,
  _args: unknown,
  context: GraphQLContext
): Promise<User | null> {
  return context.user ? await prisma.user.findUnique({ where: { id: context.user.id } }) : null;
}

export const authResolvers: Partial<Resolvers> = {
  Query: {
    me: async (_parent, _args, context) => {
      return me(_parent, _args, context);
    },
  },
  Mutation: {
    signUp: async (_parent, args, context) => {
      return signup(_parent, args, context);
    },
    login: async (_parent, args, context) => {
      return login(_parent, args, context);
    },
    googleAuth: async (_parent, args, context) => {
      return googleAuth(_parent, args, context);
    },
    refreshToken: async (_parent, args, context) => {
      return refreshToken(_parent, args, context);
    },
    logout: async (_parent, _args, context) => {
      return logout(_parent, _args, context);
    },
    logoutAll: async (_parent, _args, context) => {
      return logoutAll(_parent, _args, context);
    },
  },
};

