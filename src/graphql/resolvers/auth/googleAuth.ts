import { MutationResolvers } from "../../../generated/graphql";
import { GraphQLError } from "graphql";
import { generateTokens, createSession } from "../../../utils/auth";
import { verifyGoogleToken, handleGoogleAuth } from "../../../utils/googleAuth";
import { AuthResponse } from "../../../types/authTypes";
import { setAuthCookies } from "../../../utils/auth";
import { UserResponseType } from "../../../types/userTypes";
import { checkUserBan } from "../../../utils/banCheck";
import { prisma } from "../../../utils/prisma";

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

  const googleUser = await verifyGoogleToken(idToken);

  const user = await handleGoogleAuth(googleUser);

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

  const tokens = generateTokens(user);

  const deviceInfo = context.req.headers['user-agent'] || undefined;
  const ipAddress = context.req.ip || context.req.socket.remoteAddress || undefined;
  await createSession(user.id, tokens, deviceInfo, ipAddress);

  setAuthCookies(context.res, tokens);

  return {
    user: user as UserResponseType,
    accessToken: tokens.accessToken,
    accessTokenExpiresAt: tokens.accessTokenExpiresAt.toISOString(),
  } as AuthResponse;
};

