import { Request, Response } from 'express';
import { AuthenticatedUser } from '../types/authTypes';
import { getOperationName } from './getOperationName';
import { getAccessTokenFromCookie, getUserFromToken } from './auth';
import { PUBLIC_OPERATIONS } from './publicOperations';
import { prisma } from './prisma';
import { GraphQLContext } from '../types/graphqlContextTypes';

export type { GraphQLContext };

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

  const operationType = req.body?.query?.includes('mutation')
    ? 'mutation'
    : req.body?.query?.includes('subscription')
    ? 'subscription'
    : 'query';

  if (isPublicOperation) {
    return {
      req,
      res,
      prisma,
      user: null,
      _operationName: operationName,
      _operationType: operationType,
      _isPublic: true,
    };
  }

  const token = getAccessTokenFromCookie(req);
  
  if (token) {
    const dbUser = await getUserFromToken(token);
    user = dbUser;
  }

  return {
    req,
    res,
    prisma,
    user,
    _operationName: operationName,
    _operationType: operationType,
    _isPublic: false,
  };
}

