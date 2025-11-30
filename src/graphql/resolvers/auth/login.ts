import { MutationResolvers, UserGraphqlType } from "../../../generated/graphql";
import { GraphQLError } from "graphql";
import { verifyPassword, generateTokens, createSession } from "../../../utils/auth";
import { prisma } from "../../../utils/context";
import { AuthResponse } from "./types";
import {
  isAccountLocked,
  recordFailedLoginAttempt,
  resetFailedLoginAttempts,
  getRemainingAttempts,
} from "../../../utils/bruteForceProtection";
import { checkUserBan, getBanMessage } from "../../../utils/banCheck";

export const login: MutationResolvers["login"] = async (
  root,
  args,
  context
) => {
  const { email, password } = args.input;

  if (!email || !password) {
    throw new GraphQLError('Email and password are required', {
      extensions: { code: 'BAD_USER_INPUT' },
    });
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  // Always return generic error to prevent user enumeration
  const genericError = new GraphQLError('Invalid email or password', {
    extensions: { code: 'UNAUTHENTICATED' },
  });

  if (!user) {
    // Add a small delay to prevent timing attacks
    await new Promise(resolve => setTimeout(resolve, 100));
    throw genericError;
  }

  // Check if user is banned (handles both permanent and temporary bans)
  const banStatus = await checkUserBan(prisma, user);
  if (banStatus.isBanned) {
    const banMessage = getBanMessage(banStatus);
    throw new GraphQLError(banMessage, {
      extensions: {
        code: 'FORBIDDEN',
        isPermanent: banStatus.isPermanent,
        bannedUntil: banStatus.bannedUntil?.toISOString(),
        bannedReason: banStatus.bannedReason,
        minutesRemaining: banStatus.minutesRemaining,
      },
    });
  }

  // Check if account is locked due to brute force attempts
  const lockStatus = await isAccountLocked(prisma, user.id);
  if (lockStatus.locked && lockStatus.lockedUntil) {
    const minutesRemaining = Math.ceil(
      (lockStatus.lockedUntil.getTime() - Date.now()) / (1000 * 60)
    );
    throw new GraphQLError(
      `Account is temporarily locked due to too many failed login attempts. Please try again in ${minutesRemaining} minute(s).`,
      {
        extensions: {
          code: 'FORBIDDEN',
          lockedUntil: lockStatus.lockedUntil.toISOString(),
        },
      }
    );
  }

  // Check if user has a password (OAuth users don't have passwords)
  if (!user.password) {
    await new Promise(resolve => setTimeout(resolve, 100));
    throw new GraphQLError('Please sign in with Google', {
      extensions: { code: 'UNAUTHENTICATED' },
    });
  }

  // Verify password
  const isValidPassword = await verifyPassword(password, user.password);
  if (!isValidPassword) {
    // Record failed login attempt
    const lockResult = await recordFailedLoginAttempt(prisma, user.id);
    const remainingAttempts = await getRemainingAttempts(prisma, user.id);

    if (lockResult.locked) {
      throw new GraphQLError(
        'Account has been temporarily locked due to too many failed login attempts. Please try again in 15 minutes.',
        {
          extensions: {
            code: 'FORBIDDEN',
            lockedUntil: lockResult.lockedUntil?.toISOString(),
          },
        }
      );
    }

    // Add delay to prevent timing attacks
    await new Promise(resolve => setTimeout(resolve, 100));

    throw new GraphQLError(
      `Invalid email or password. ${remainingAttempts} attempt(s) remaining before account lockout.`,
      {
        extensions: {
          code: 'UNAUTHENTICATED',
          remainingAttempts,
        },
      }
    );
  }

  if (!user.isActive) {
    throw new GraphQLError('Account is inactive', {
      extensions: { code: 'FORBIDDEN' },
    });
  }

  if (!user.isVerified) {
    throw new GraphQLError('Please verify your email address before logging in. Check your email for the verification code.', {
      extensions: { code: 'UNAUTHENTICATED' },
    });
  }

  // Reset failed login attempts on successful login
  await resetFailedLoginAttempts(prisma, user.id);

  const tokens = generateTokens(user);

  const deviceInfo = context.req.headers['user-agent'] || undefined;
  const ipAddress = context.req.ip || context.req.socket.remoteAddress || undefined;
  await createSession(user.id, tokens, deviceInfo, ipAddress);

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLogin: new Date() },
  });

  return {
    user: user as unknown as UserGraphqlType,
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    accessTokenExpiresAt: tokens.accessTokenExpiresAt.toISOString(),
    refreshTokenExpiresAt: tokens.refreshTokenExpiresAt.toISOString(),
  } as AuthResponse;
};

