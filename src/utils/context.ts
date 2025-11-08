import { Request, Response } from 'express';
import { PrismaClient, User } from '@prisma/client';
import { verifyAccessToken } from './auth';
import { AuthenticatedUser } from './rbac';
import { getOperationName } from './getOperationName';

export const prisma = new PrismaClient();

const PUBLIC_OPERATIONS = [
  'IntrospectionQuery',
  'signUp',
  'login',
  'googleAuth',
  'refreshToken',
];

async function getUserFromToken(token: string): Promise<User | null> {
  const payload = verifyAccessToken(token);
  if (!payload) {
    return null;
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
    return null;
  }

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

export async function createContext({
  req,
  res,
}: {
  req: Request;
  res: Response;
}): Promise<GraphQLContext> {
  let user: AuthenticatedUser | null = null;

  let operationName: string | null = null;
  
  if (req.body?.operationName) {
    operationName = req.body.operationName;
  } else if (req.body?.query) {
    operationName = getOperationName(req.body.query);
  }

  const isPublicOperation = operationName
    ? PUBLIC_OPERATIONS.some(
        (op) => op.toLowerCase() === operationName?.toLowerCase()
      )
    : false;

  if (isPublicOperation) {
    return {
      req,
      res,
      prisma,
      user: null,
    };
  }

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

