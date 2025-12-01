import { GraphQLError } from 'graphql';
import { OAuth2Client } from 'google-auth-library';
import { prisma } from './prisma';
import { sendEmail } from './mailer';
import { generateWelcomeEmail } from './emailTemplates';
import { GoogleUserInfo } from '../types/userTypes';
import { generateUniqueUsername } from './generateUsername';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

export const googleClient = GOOGLE_CLIENT_ID ? new OAuth2Client(GOOGLE_CLIENT_ID) : null;


export async function verifyGoogleToken(idToken: string): Promise<GoogleUserInfo> {
  if (!googleClient) {
    throw new GraphQLError('Google OAuth is not configured', {
      extensions: { code: 'INTERNAL_SERVER_ERROR' },
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

export async function handleGoogleAuth(googleUser: GoogleUserInfo) {
  const { googleId, email, name, avatar } = googleUser;

  let user = await prisma.user.findUnique({
    where: { googleId },
  });

  if (user) {
    user = await prisma.user.update({
      where: { id: user.id },
      data: {
        lastLogin: new Date(),
        ...(avatar && { avatar }),
      },
    });
  } else {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      user = await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          googleId,
          avatar: avatar || existingUser.avatar,
          lastLogin: new Date(),
          isVerified: true,
        },
      });
    } else {
      const uniqueUsername = await generateUniqueUsername(
        name.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 20)
      );

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

      const emailData = generateWelcomeEmail({
        name,
        loginLink: `${process.env.FRONTEND_URL}/auth/login`,
      });
      await sendEmail({
        to: email,
        ...emailData,
      });
    }
  }

  if (!user.isActive) {
    user = await prisma.user.update({
      where: { id: user.id },
      data: {
        isActive: true,
      },
    });
  }

  return user;
}

