import { MutationResolvers, UserGraphqlType } from "../../../generated/graphql";
import { GraphQLError } from "graphql";
import { generateTokens, createSession } from "../../../utils/auth";
import { prisma } from "../../../utils/context";
import { OTPType } from "@prisma/client";
import { AuthResponse } from "./types";
import { verifyOTP } from "./utils";

export const verifyEmail: MutationResolvers["verifyEmail"] = async (
  root,
  args,
  context
) => {
  const { email, code } = args.input;

  if (!email || !code) {
    throw new GraphQLError('Email and code are required', {
      extensions: { code: 'BAD_USER_INPUT' },
    });
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new GraphQLError('User not found', {
      extensions: { code: 'NOT_FOUND' },
    });
  }

  const isValid = await verifyOTP(user.id, code, OTPType.EMAIL_VERIFICATION);

  if (!isValid) {
    throw new GraphQLError('Invalid or expired verification code', {
      extensions: { code: 'BAD_USER_INPUT' },
    });
  }

  if (user.isVerified) {
    throw new GraphQLError('Email is already verified', {
      extensions: { code: 'BAD_USER_INPUT' },
    });
  }

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: { isVerified: true },
  });

  const tokens = generateTokens(updatedUser);

  const deviceInfo = context.req.headers['user-agent'] || undefined;
  const ipAddress = context.req.ip || context.req.socket.remoteAddress || undefined;
  await createSession(updatedUser.id, tokens, deviceInfo, ipAddress);

  await prisma.user.update({
    where: { id: updatedUser.id },
    data: { lastLogin: new Date() },
  });

  return {
    user: updatedUser as unknown as UserGraphqlType,
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    accessTokenExpiresAt: tokens.accessTokenExpiresAt.toISOString(),
    refreshTokenExpiresAt: tokens.refreshTokenExpiresAt.toISOString(),
  } as AuthResponse;
};

