import { prisma } from './prisma';
import { OTPType } from '@prisma/client';

export async function generateOTP(
  userId: string,
  type: OTPType = OTPType.EMAIL_VERIFICATION,
  expiresInMinutes: number = 15
): Promise<string> {
  await prisma.oTPCode.deleteMany({
    where: {
      userId,
      type,
      OR: [
        { isUsed: true },
        { expiresAt: { lt: new Date() } },
      ],
    },
  });

  let code: string;
  let isUnique = false;
  const maxAttempts = 100;
  let attempts = 0;

  while (!isUnique && attempts < maxAttempts) {
    code = Math.floor(100000 + Math.random() * 900000).toString();
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
    attempts++;
  }

  if (!isUnique) {
    throw new Error('Failed to generate unique OTP code after maximum attempts');
  }

  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + expiresInMinutes);

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

  await prisma.oTPCode.delete({
    where: { id: otpRecord.id },
  });

  return true;
}

export async function cleanupExpiredOTPs(): Promise<number> {
  const result = await prisma.oTPCode.deleteMany({
    where: {
      OR: [
        { isUsed: true },
        { expiresAt: { lt: new Date() } },
      ],
    },
  });

  return result.count;
}

