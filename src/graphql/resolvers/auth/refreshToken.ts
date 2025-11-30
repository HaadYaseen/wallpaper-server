import { MutationResolvers, UserGraphqlType } from "../../../generated/graphql";
import { GraphQLError } from "graphql";
import { generateTokens, verifyRefreshToken } from "../../../utils/auth";
import { prisma } from "../../../utils/context";
import { AuthResponse } from "./types";

export const refreshToken: MutationResolvers["refreshToken"] = async (
  root,
  args,
  context
) => {
  const { refreshToken: token } = args;

  if (!token) {
    throw new GraphQLError('Refresh token is required', {
      extensions: { code: 'BAD_USER_INPUT' },
    });
  }

  const payload = verifyRefreshToken(token);
  if (!payload) {
    throw new GraphQLError('Invalid refresh token', {
      extensions: { code: 'UNAUTHENTICATED' },
    });
  }

  const session = await prisma.session.findFirst({
    where: {
      userId: payload.userId,
      refreshToken: token,
      isActive: true,
      refreshTokenExpiresAt: { gt: new Date() },
    },
  });

  if (!session) {
    throw new GraphQLError('Session expired or invalid', {
      extensions: { code: 'UNAUTHENTICATED' },
    });
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
  });

  if (!user || !user.isActive || user.isBanned) {
    throw new GraphQLError('Account is inactive or banned', {
      extensions: { code: 'FORBIDDEN' },
    });
  }

  const tokens = generateTokens(user);

  await prisma.session.update({
    where: { id: session.id },
    data: {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      accessTokenExpiresAt: tokens.accessTokenExpiresAt,
      refreshTokenExpiresAt: tokens.refreshTokenExpiresAt,
      lastUsedAt: new Date(),
    },
  });

  return {
    user: user as unknown as UserGraphqlType,
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    accessTokenExpiresAt: tokens.accessTokenExpiresAt.toISOString(),
    refreshTokenExpiresAt: tokens.refreshTokenExpiresAt.toISOString(),
  } as AuthResponse;
};

