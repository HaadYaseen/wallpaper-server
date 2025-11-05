import { Role } from '@prisma/client';
import { GraphQLError } from 'graphql';

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: Role;
  isActive: boolean;
  isBanned: boolean;
  isVerified: boolean;
}

/**
 * Check if user has required role
 */
export function hasRole(user: AuthenticatedUser | null, requiredRoles: Role[]): boolean {
  if (!user) {
    return false;
  }

  if (!user.isActive || user.isBanned) {
    return false;
  }

  return requiredRoles.includes(user.role);
}

/**
 * Require authentication - throws if user is not authenticated
 */
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

/**
 * Require specific role(s) - throws if user doesn't have required role
 */
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

/**
 * Role hierarchy - higher roles have more permissions
 */
export const ROLE_HIERARCHY: Record<Role, number> = {
  USER: 1,
  JUDGE: 2,
  ADMIN: 3,
  SUPER_ADMIN: 4,
};

/**
 * Check if user role is at least as high as required role
 */
export function hasMinimumRole(user: AuthenticatedUser | null, minimumRole: Role): boolean {
  if (!user) {
    return false;
  }

  if (!user.isActive || user.isBanned) {
    return false;
  }

  return ROLE_HIERARCHY[user.role] >= ROLE_HIERARCHY[minimumRole];
}

