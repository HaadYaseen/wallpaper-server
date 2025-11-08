import { MutationResolvers, UserGraphqlType } from "../../../generated/graphql";
import { GraphQLError } from "graphql";
import { verifyPassword, generateTokens, createSession } from "../../../utils/auth";
import { prisma } from "../../../utils/context";
import { AuthResponse } from "./types";

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
    user: user as unknown as UserGraphqlType,
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    accessTokenExpiresAt: tokens.accessTokenExpiresAt.toISOString(),
    refreshTokenExpiresAt: tokens.refreshTokenExpiresAt.toISOString(),
  } as AuthResponse;
};

