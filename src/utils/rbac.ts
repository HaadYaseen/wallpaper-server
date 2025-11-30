import { Role } from '@prisma/client';
import { GraphQLError } from 'graphql';
import { AuthenticatedUser } from '../types/authTypes';

export function hasRole(user: AuthenticatedUser | null, requiredRoles: Role[]): boolean {
  if (!user) {
    return false;
  }

  if (!user.isActive || user.isBanned) {
    return false;
  }

  return requiredRoles.includes(user.role);
}

export function requireAuth(user: AuthenticatedUser | null): AuthenticatedUser {
  if (!user) {
    throw new GraphQLError('Authentication required', {
      extensions: {
        code: 'UNAUTHENTICATED',
      },
    });
  }

  if (!user.isActive) {
    throw new GraphQLError('Account is inactive', {
      extensions: {
        code: 'FORBIDDEN',
      },
    });
  }

  if (!user.isVerified) {
    throw new GraphQLError('Email verification required', {
      extensions: {
        code: 'FORBIDDEN',
      },
    });
  }

  if (user.isBanned) {
    throw new GraphQLError('Account is banned', {
      extensions: {
        code: 'FORBIDDEN',
      },
    });
  }

  return user;
}

export function requireRole(user: AuthenticatedUser | null, requiredRoles: Role[]): AuthenticatedUser {
  const authenticatedUser = requireAuth(user);

  if (!hasRole(authenticatedUser, requiredRoles)) {
    throw new GraphQLError('Insufficient permissions', {
      extensions: {
        code: 'FORBIDDEN',
      },
    });
  }

  return authenticatedUser;
}

export const ROLE_HIERARCHY: Record<Role, number> = {
  USER: 1,
  JUDGE: 2,
  ADMIN: 3,
  SUPER_ADMIN: 4,
};

export function hasMinimumRole(user: AuthenticatedUser | null, minimumRole: Role): boolean {
  if (!user) {
    return false;
  }

  if (!user.isActive || user.isBanned) {
    return false;
  }

  return ROLE_HIERARCHY[user.role] >= ROLE_HIERARCHY[minimumRole];
}

