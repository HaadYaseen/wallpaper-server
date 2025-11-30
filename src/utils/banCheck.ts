import { PrismaClient, User } from '@prisma/client';

export interface BanStatus {
  isBanned: boolean;
  isPermanent: boolean;
  bannedUntil?: Date;
  bannedReason?: string;
  bannedAt?: Date;
  minutesRemaining?: number;
}
export async function checkUserBan(
  prisma: PrismaClient,
  user: Pick<User, 'id' | 'isBanned' | 'bannedUntil' | 'bannedReason' | 'bannedAt'>
): Promise<BanStatus> {
  if (!user.isBanned) {
    return { isBanned: false, isPermanent: false };
  }

  if (user.bannedUntil && user.bannedUntil < new Date()) {
    // Temporary ban expired, automatically unban the user
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isBanned: false,
        bannedUntil: null,
        bannedReason: null,
        bannedAt: null,
      },
    });
    return { isBanned: false, isPermanent: false };
  }

  const isPermanent = !user.bannedUntil;
  const now = new Date();
  const minutesRemaining = user.bannedUntil
    ? Math.ceil((user.bannedUntil.getTime() - now.getTime()) / (1000 * 60))
    : undefined;

  return {
    isBanned: true,
    isPermanent,
    bannedUntil: user.bannedUntil || undefined,
    bannedReason: user.bannedReason || undefined,
    bannedAt: user.bannedAt || undefined,
    minutesRemaining,
  };
}

export function getBanMessage(banStatus: BanStatus): string {
  if (!banStatus.isBanned) {
    return '';
  }

  if (banStatus.isPermanent) {
    const reason = banStatus.bannedReason
      ? ` Reason: ${banStatus.bannedReason}`
      : '';
    return `Your account has been permanently banned.${reason} Please contact support if you believe this is an error.`;
  }

  const minutesText = banStatus.minutesRemaining
    ? banStatus.minutesRemaining > 0
      ? `${banStatus.minutesRemaining} minute(s)`
      : 'a few moments'
    : 'the ban period';
  const reason = banStatus.bannedReason
    ? ` Reason: ${banStatus.bannedReason}.`
    : '';

  return `Your account has been temporarily banned. Please try again in ${minutesText}.${reason}`;
}

