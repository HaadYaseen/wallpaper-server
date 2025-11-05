import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User, Role } from '@prisma/client';
import { prisma } from './context';

// JWT Configuration
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key-change-in-production';
const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY || '15m';
const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY || '7d';

export interface TokenPayload {
  userId: string;
  email: string;
  role: Role;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: Date;
  refreshTokenExpiresAt: Date;
}

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Generate JWT access token
 */
export function generateAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
}

/**
 * Generate JWT refresh token
 */
export function generateRefreshToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });
}

/**
 * Generate both access and refresh tokens
 */
export function generateTokens(user: User): AuthTokens {
  const payload: TokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  // Calculate expiry dates
  const accessTokenExpiresAt = new Date();
  accessTokenExpiresAt.setMinutes(accessTokenExpiresAt.getMinutes() + 15); // 15 minutes

  const refreshTokenExpiresAt = new Date();
  refreshTokenExpiresAt.setDate(refreshTokenExpiresAt.getDate() + 7); // 7 days

  return {
    accessToken,
    refreshToken,
    accessTokenExpiresAt,
    refreshTokenExpiresAt,
  };
}

/**
 * Verify and decode access token
 */
export function verifyAccessToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
}

/**
 * Verify and decode refresh token
 */
export function verifyRefreshToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
}

/**
 * Create a session in the database
 */
export async function createSession(
  userId: string,
  tokens: AuthTokens,
  deviceInfo?: string,
  ipAddress?: string
) {
  return prisma.session.create({
    data: {
      userId,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      accessTokenExpiresAt: tokens.accessTokenExpiresAt,
      refreshTokenExpiresAt: tokens.refreshTokenExpiresAt,
      deviceInfo,
      ipAddress,
    },
  });
}

/**
 * Revoke a session (logout)
 */
export async function revokeSession(sessionId: string): Promise<void> {
  await prisma.session.update({
    where: { id: sessionId },
    data: { isActive: false },
  });
}

/**
 * Revoke all sessions for a user
 */
export async function revokeAllUserSessions(userId: string): Promise<void> {
  await prisma.session.updateMany({
    where: { userId, isActive: true },
    data: { isActive: false },
  });
}


