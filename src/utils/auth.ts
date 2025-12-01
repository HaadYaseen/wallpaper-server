import bcrypt from 'bcrypt';
import jwt, { SignOptions, JwtPayload } from 'jsonwebtoken';
import { User, Role } from '@prisma/client';
import { prisma } from './prisma';
import { AuthTokens, TokenPayload } from '../types/authTypes';
import { GraphQLError } from 'graphql';
import { Response } from 'express';

function getRequiredEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

const JWT_SECRET = getRequiredEnvVar('JWT_SECRET');
const JWT_REFRESH_SECRET = getRequiredEnvVar('JWT_REFRESH_SECRET');
const ACCESS_TOKEN_EXPIRY = getRequiredEnvVar('ACCESS_TOKEN_EXPIRY');
const REFRESH_TOKEN_EXPIRY = getRequiredEnvVar('REFRESH_TOKEN_EXPIRY');
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: 'none' as const,
  path: '/',
};

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

export function generateTokens(user: User): AuthTokens {
  const payload: TokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwt.sign(payload, JWT_SECRET, {expiresIn: ACCESS_TOKEN_EXPIRY} as SignOptions);
  const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {expiresIn: REFRESH_TOKEN_EXPIRY} as SignOptions);

  const accessTokenExpiresAt = new Date();
  accessTokenExpiresAt.setMinutes(accessTokenExpiresAt.getMinutes() + 15); 

  const refreshTokenExpiresAt = new Date();
  refreshTokenExpiresAt.setDate(refreshTokenExpiresAt.getDate() + 7); 

  return {
    accessToken,
    refreshToken,
    accessTokenExpiresAt,
    refreshTokenExpiresAt,
  };
}

export function verifyAccessToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    if (decoded.userId && decoded.email && decoded.role) {
      return {
        userId: decoded.userId as string,
        email: decoded.email as string,
        role: decoded.role as Role,
      };
    }
    return null;
  } catch (error) {
    console.error('Error verifying access token:', error);
    throw new GraphQLError('Error verifying access token', {
      extensions: { code: 'UNAUTHENTICATED' },
    });
  }
}

export function verifyRefreshToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET) as JwtPayload;
    if (decoded.userId && decoded.email && decoded.role) {
      return {
        userId: decoded.userId as string,
        email: decoded.email as string,
        role: decoded.role as Role,
      };
    }
    throw new GraphQLError('Invalid refresh token', {
      extensions: { code: 'UNAUTHENTICATED' },
    });
  } catch (error) {
    console.error('Error verifying refresh token:', error);
    throw new GraphQLError('Error verifying refresh token', {
      extensions: { code: 'UNAUTHENTICATED' },
    });
  }
}

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

export async function revokeSession(sessionId: string): Promise<void> {
  await prisma.session.update({
    where: { id: sessionId },
    data: { isActive: false },
  });
}

export async function revokeAllUserSessions(userId: string): Promise<void> {
  await prisma.session.updateMany({
    where: { userId, isActive: true },
    data: { isActive: false },
  });
}

export function setAuthCookies(res: Response, tokens: AuthTokens): void {
  // Set access token cookie (15 minutes)
  const accessTokenMaxAge = 15 * 60 * 1000; 
  res.cookie('accessToken', tokens.accessToken, {
    ...COOKIE_OPTIONS,
    maxAge: accessTokenMaxAge,
  });

  // Set refresh token cookie (7 days)
  const refreshTokenMaxAge = 7 * 24 * 60 * 60 * 1000; 
  res.cookie('refreshToken', tokens.refreshToken, {
    ...COOKIE_OPTIONS,
    maxAge: refreshTokenMaxAge,
  });
}

export function clearAuthCookies(res: Response): void {
  res.clearCookie('accessToken', COOKIE_OPTIONS);
  res.clearCookie('refreshToken', COOKIE_OPTIONS);
}

export function getAccessTokenFromCookie(req: any): string | null {
  return req.cookies?.accessToken || null;
}

export function getRefreshTokenFromCookie(req: any): string | null {
  return req.cookies?.refreshToken || null;
}

export async function getUserFromToken(token: string): Promise<User | null> {
  const payload = verifyAccessToken(token);
  if (!payload) {
    throw new GraphQLError('Invalid access token', {
      extensions: { code: 'UNAUTHENTICATED' },
    });
  }

  const session = await prisma.session.findFirst({
    where: {
      userId: payload.userId,
      accessToken: token,
      isActive: true,
      accessTokenExpiresAt: { gt: new Date() },
    },
  });

  if (!session) {
    throw new GraphQLError('Invalid session', {
      extensions: { code: 'UNAUTHENTICATED' },
    });
  }

  await prisma.session.update({
    where: { id: session.id },
    data: { lastUsedAt: new Date() },
  });

  return prisma.user.findUnique({
    where: { id: payload.userId },
  });
}
