import { MutationResolvers, UserGraphqlType } from "../../../generated/graphql";
import { GraphQLError } from "graphql";
import { hashPassword, generateTokens, createSession } from "../../../utils/auth";
import { prisma } from "../../../utils/context";
import { generateUniqueUsername } from "./utils";
import { AuthResponse } from "./types";

export const signUp: MutationResolvers["signUp"] = async (
  root,
  args,
  context
) => {
  const { email, password, name, username, avatar } = args.input;

  // Validate input
  if (!email || !password || !name || !username) {
    throw new GraphQLError('All fields are required', {
      extensions: { code: 'BAD_USER_INPUT' },
    });
  }

  if (password.length < 8) {
    throw new GraphQLError('Password must be at least 8 characters', {
      extensions: { code: 'BAD_USER_INPUT' },
    });
  }
  
  if (username.toLowerCase().includes('admin') || name.toLowerCase().includes('admin')) {
    throw new GraphQLError('Username and name cannot contain "admin"', {
      extensions: { code: 'BAD_USER_INPUT' },
    });
  }

  if (username.toLowerCase().includes('superadmin') || name.toLowerCase().includes('superadmin')) {
    throw new GraphQLError('Username and name cannot contain "superadmin"', {
      extensions: { code: 'BAD_USER_INPUT' },
    });
  }
  
  // Check if user already exists
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { username }],
    },
  });

  if (existingUser) {
    throw new GraphQLError('User with this email or username already exists', {
      extensions: { code: 'BAD_USER_INPUT' },
    });
  }

  // Generate unique username if needed
  const uniqueUsername = await generateUniqueUsername(username);

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      username: uniqueUsername,
      avatar: avatar || null,
      isVerified: false, // Email verification required for local accounts
    },
  });

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

