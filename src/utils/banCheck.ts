import { PrismaClient, User } from '@prisma/client';

export interface BanCheckResult {
  isBanned: boolean;
  isPermanent: boolean;
  bannedUntil?: Date;
  bannedReason?: string;
  bannedAt?: Date;
  minutesRemaining?: number;
  message: string;
}

export async function checkUserBan(
  prisma: PrismaClient,
  user: Pick<User, 'id' | 'isBanned' | 'bannedUntil' | 'bannedReason' | 'bannedAt'>
): Promise<BanCheckResult> {

  if (!user.isBanned) {
    return {
      isBanned: false,
      isPermanent: false,
      message: '',
    };
  }

  if (user.bannedUntil && user.bannedUntil < new Date()) {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isBanned: false,
        bannedUntil: null,
        bannedReason: null,
        bannedAt: null,
      },
    });
    return {
      isBanned: false,
      isPermanent: false,
      message: '',
    };
  }

  const isPermanent = !user.bannedUntil;
  const now = new Date();
  const minutesRemaining = user.bannedUntil
    ? Math.ceil((user.bannedUntil.getTime() - now.getTime()) / (1000 * 60))
    : undefined;

  let message = '';
  if (isPermanent) {
    const reason = user.bannedReason
      ? ` Reason: ${user.bannedReason}`
      : '';
    message = `Your account has been permanently banned.${reason} Please contact support if you believe this is an error.`;
  } else {
    const minutesText = minutesRemaining
      ? minutesRemaining > 0
        ? `${minutesRemaining} minute(s)`
        : 'a few moments'
      : 'the ban period';
    const reason = user.bannedReason
      ? ` Reason: ${user.bannedReason}.`
      : '';
    message = `Your account has been temporarily banned. Please try again in ${minutesText}.${reason}`;
  }

  return {
    isBanned: true,
    isPermanent,
    bannedUntil: user.bannedUntil || undefined,
    bannedReason: user.bannedReason || undefined,
    bannedAt: user.bannedAt || undefined,
    minutesRemaining,
    message,
  };
}
