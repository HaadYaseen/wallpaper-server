import { GraphQLError } from 'graphql';
import { OAuth2Client } from 'google-auth-library';
import { prisma } from '../../../utils/context';
import { OTPType } from '@prisma/client';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

export const googleClient = GOOGLE_CLIENT_ID ? new OAuth2Client(GOOGLE_CLIENT_ID) : null;

export async function verifyGoogleToken(idToken: string): Promise<{
  googleId: string;
  email: string;
  name: string;
  avatar?: string;
}> {
  if (!googleClient) {
    throw new GraphQLError('Google OAuth is not configured', {
      extensions: { code: 'BAD_USER_INPUT' },
    });
  }

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: GOOGLE_CLIENT_ID!,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      throw new GraphQLError('Invalid Google token', {
        extensions: { code: 'UNAUTHENTICATED' },
      });
    }

    return {
      googleId: payload.sub,
      email: payload.email!,
      name: payload.name || payload.email!.split('@')[0],
      avatar: payload.picture,
    };
  } catch (error) {
    throw new GraphQLError('Invalid or expired Google token', {
      extensions: { code: 'UNAUTHENTICATED' },
    });
  }
}

export async function generateUniqueUsername(baseUsername: string): Promise<string> {
  let username = baseUsername.toLowerCase().replace(/[^a-z0-9]/g, '');
  let counter = 1;
  let finalUsername = username;

  while (await prisma.user.findUnique({ where: { username: finalUsername } })) {
    finalUsername = `${username}${counter}`;
    counter++;
  }

  return finalUsername;
}

export function makeRandomOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function generateOTP(
  userId: string,
  type: OTPType = OTPType.EMAIL_VERIFICATION,
  expiresInMinutes: number = 15
): Promise<string> {
  let code: string;
  let isUnique = false;

  while (!isUnique) {
    code = makeRandomOTP();
    const existingOTP = await prisma.oTPCode.findFirst({
      where: {
        code,
        isUsed: false,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    isUnique = !existingOTP;
  }

  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + expiresInMinutes);

  await prisma.oTPCode.updateMany({
    where: {
      userId,
      type,
      isUsed: false,
    },
    data: {
      isUsed: true,
      usedAt: new Date(),
    },
  });

  await prisma.oTPCode.create({
    data: {
      userId,
      code: code!,
      type,
      expiresAt,
    },
  });

  return code!;
}

export async function verifyOTP(
  userId: string,
  code: string,
  type: OTPType = OTPType.EMAIL_VERIFICATION
): Promise<boolean> {
  const otpRecord = await prisma.oTPCode.findFirst({
    where: {
      userId,
      code,
      type,
      isUsed: false,
      expiresAt: {
        gt: new Date(),
      },
    },
  });

  if (!otpRecord) {
    return false;
  }

  await prisma.oTPCode.update({
    where: { id: otpRecord.id },
    data: {
      isUsed: true,
      usedAt: new Date(),
    },
  });

  return true;
}

