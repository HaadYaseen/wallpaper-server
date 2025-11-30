import { MutationResolvers, UserResponseType } from "../../../generated/graphql";
import { GraphQLError } from "graphql";
import { generateTokens, verifyRefreshToken } from "../../../utils/auth";
import { prisma } from "../../../utils/prisma";
import { AuthResponse } from "../../../types/authTypes";
import { setAuthCookies, getRefreshTokenFromCookie } from "../../../utils/auth";

export const refreshToken: MutationResolvers["refreshToken"] = async (
  root,
  args,
  context
) => {
  const tokenFromCookie = getRefreshTokenFromCookie(context.req);
  const token = tokenFromCookie

  if (!token) {
    throw new GraphQLError('Refresh token is missing', {
      extensions: { code: 'UNAUTHENTICATED' },
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

  setAuthCookies(context.res, tokens);

  return {
    user: user as UserResponseType,
    accessToken: tokens.accessToken,
    accessTokenExpiresAt: tokens.accessTokenExpiresAt.toISOString(),
  } as AuthResponse;
};

