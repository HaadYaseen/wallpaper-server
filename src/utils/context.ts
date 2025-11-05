import { Request, Response } from 'express';
import { PrismaClient, User } from '@prisma/client';
import { verifyAccessToken } from './auth';
import { AuthenticatedUser } from './rbac';

// Shared Prisma instance
export const prisma = new PrismaClient();

/**
 * Get user from token (for context)
 */
async function getUserFromToken(token: string): Promise<User | null> {
  const payload = verifyAccessToken(token);
  if (!payload) {
    return null;
  }

  // Verify session is still active
  const session = await prisma.session.findFirst({
    where: {
      userId: payload.userId,
      accessToken: token,
      isActive: true,
      accessTokenExpiresAt: { gt: new Date() },
    },
  });

  if (!session) {
    return null;
  }

  // Update last used timestamp
  await prisma.session.update({
    where: { id: session.id },
    data: { lastUsedAt: new Date() },
  });

  return prisma.user.findUnique({
    where: { id: payload.userId },
  });
}

export interface GraphQLContext {
  req: Request;
  res: Response;
  prisma: PrismaClient;
  user: AuthenticatedUser | null;
}

/**
 * Create GraphQL context with authentication
 */
export async function createContext({
  req,
  res,
}: {
  req: Request;
  res: Response;
}): Promise<GraphQLContext> {
  let user: AuthenticatedUser | null = null;

  // Extract token from Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const dbUser = await getUserFromToken(token);

    if (dbUser) {
      user = {
        id: dbUser.id,
        email: dbUser.email,
        role: dbUser.role,
        isActive: dbUser.isActive,
        isBanned: dbUser.isBanned,
        isVerified: dbUser.isVerified,
      };
    }
  }

  return {
    req,
    res,
    prisma,
    user,
  };
}

