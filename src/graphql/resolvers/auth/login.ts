import { MutationResolvers } from "../../../generated/graphql";
import { UserResponseType } from "../../../types/userTypes";
import { GraphQLError } from "graphql";
import { generateTokens, createSession } from "../../../utils/auth";
import { prisma } from "../../../utils/prisma";
import { AuthResponse } from "../../../types/authTypes";
import { setAuthCookies } from "../../../utils/auth";
import {
  isAccountLocked,
  recordFailedLoginAttempt,
  resetFailedLoginAttempts,
  getRemainingAttempts,
} from "../../../utils/bruteForceProtection";
import { checkUserBan } from "../../../utils/banCheck";
import bcrypt from 'bcrypt';

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

  if (!user) {
    // Add a small delay to prevent timing attacks
    await new Promise(resolve => setTimeout(resolve, 100));
    throw new GraphQLError('Invalid email or password', {
      extensions: { code: 'UNAUTHENTICATED' },
    });
  }

  const banStatus = await checkUserBan(prisma, user);
  if (banStatus.isBanned) {
    throw new GraphQLError(banStatus.message, {
      extensions: {
        code: 'FORBIDDEN',
        isPermanent: banStatus.isPermanent,
        bannedUntil: banStatus.bannedUntil?.toISOString(),
        bannedReason: banStatus.bannedReason,
        minutesRemaining: banStatus.minutesRemaining,
      },
    });
  }

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

  if (!user.password) {
    await new Promise(resolve => setTimeout(resolve, 100));
    throw new GraphQLError('Please sign in with Google', {
      extensions: { code: 'UNAUTHENTICATED' },
    });
  }

  const isValidPassword = await bcrypt.compare(password, user.password || '');
  if (!isValidPassword) {
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
   prisma.user.update({
    where: { id: user.id },
    data: { isActive: true },
   });
  }

  if (!user.isVerified) {
    throw new GraphQLError('Please verify your email address before logging in. Check your email for the verification code. or request a new verification code.', {
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

  setAuthCookies(context.res, tokens);

  return {
    user: user as UserResponseType,
    message: 'Login successful',
  } as AuthResponse;
};

