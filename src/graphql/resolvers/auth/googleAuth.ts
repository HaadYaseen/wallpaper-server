import { MutationResolvers, UserGraphqlType } from "../../../generated/graphql";
import { GraphQLError } from "graphql";
import { generateTokens, createSession } from "../../../utils/auth";
import { prisma } from "../../../utils/context";
import { verifyGoogleToken, generateUniqueUsername } from "./utils";
import { AuthResponse } from "./types";

export const googleAuth: MutationResolvers["googleAuth"] = async (
  root,
  args,
  context
) => {
  const { idToken } = args.input;

  if (!idToken) {
    throw new GraphQLError('Google ID token is required', {
      extensions: { code: 'BAD_USER_INPUT' },
    });
  }

  // Verify the Google ID token and get user info
  const googleUser = await verifyGoogleToken(idToken);
  const { googleId, email, name, avatar } = googleUser;

  // Check if user exists with this Google ID
  let user = await prisma.user.findUnique({
    where: { googleId },
  });

  if (user) {
    // User exists, update last login and avatar if changed
    user = await prisma.user.update({
      where: { id: user.id },
      data: {
        lastLogin: new Date(),
        ...(avatar && { avatar }),
      },
    });
  } else {
    // Check if user exists with this email (account merge scenario)
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      // Link Google account to existing user
      user = await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          googleId,
          avatar: avatar || existingUser.avatar,
          lastLogin: new Date(),
        },
      });
    } else {
      // Create new user - all data comes from verified Google token
      const baseUsername = name.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 20);
      const uniqueUsername = await generateUniqueUsername(baseUsername);

      user = await prisma.user.create({
        data: {
          email,
          name,
          username: uniqueUsername,
          googleId,
          avatar,
          isVerified: true,
          password: null,
        },
      });
    }
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

  return {
    user: user as unknown as UserGraphqlType,
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    accessTokenExpiresAt: tokens.accessTokenExpiresAt.toISOString(),
    refreshTokenExpiresAt: tokens.refreshTokenExpiresAt.toISOString(),
  } as AuthResponse;
};

