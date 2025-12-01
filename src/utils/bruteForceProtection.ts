import { PrismaClient } from '@prisma/client';

export const BRUTE_FORCE_CONFIG = {
  MAX_FAILED_ATTEMPTS: 5,
  LOCKOUT_DURATION_MINUTES: 15,
  RESET_WINDOW_MINUTES: 30,
} as const;

export async function isAccountLocked(
  prisma: PrismaClient,
  userId: string
): Promise<{ locked: boolean; lockedUntil?: Date }> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { lockedUntil: true },
  });

  if (!user || !user.lockedUntil) {
    return { locked: false };
  }

  // Check if lockout period has expired
  if (user.lockedUntil < new Date()) {
    // Lockout expired, reset the account
    await prisma.user.update({
      where: { id: userId },
      data: {
        lockedUntil: null,
        failedLoginAttempts: 0,
        lastFailedLoginAttempt: null,
      },
    });
    return { locked: false };
  }

  return { locked: true, lockedUntil: user.lockedUntil };
}

export async function recordFailedLoginAttempt(
  prisma: PrismaClient,
  userId: string
): Promise<{ locked: boolean; lockedUntil?: Date }> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      failedLoginAttempts: true,
      lastFailedLoginAttempt: true,
      lockedUntil: true,
    },
  });

  if (!user) {
    return { locked: false };
  }

  // Check if lockout period has expired
  const now = new Date();
  if (user.lockedUntil && user.lockedUntil < now) {
    // Lockout expired, reset attempts
    await prisma.user.update({
      where: { id: userId },
      data: {
        failedLoginAttempts: 0,
        lastFailedLoginAttempt: null,
        lockedUntil: null,
      },
    });
  }

  // Check if enough time has passed to reset attempts (30 minutes of inactivity)
  if (user.lastFailedLoginAttempt) {
    const timeSinceLastAttempt = now.getTime() - user.lastFailedLoginAttempt.getTime();
    const resetWindowMs = BRUTE_FORCE_CONFIG.RESET_WINDOW_MINUTES * 60 * 1000;
    
    if (timeSinceLastAttempt > resetWindowMs) {
      // Reset attempts after inactivity period
      await prisma.user.update({
        where: { id: userId },
        data: {
          failedLoginAttempts: 1,
          lastFailedLoginAttempt: now,
        },
      });
      return { locked: false };
    }
  }

  // Increment failed attempts
  const newAttemptCount = (user.failedLoginAttempts || 0) + 1;
  const shouldLock = newAttemptCount >= BRUTE_FORCE_CONFIG.MAX_FAILED_ATTEMPTS;

  if (shouldLock) {
    // Lock the account
    const lockedUntil = new Date();
    lockedUntil.setMinutes(lockedUntil.getMinutes() + BRUTE_FORCE_CONFIG.LOCKOUT_DURATION_MINUTES);

    await prisma.user.update({
      where: { id: userId },
      data: {
        failedLoginAttempts: newAttemptCount,
        lastFailedLoginAttempt: now,
        lockedUntil,
      },
    });

    return { locked: true, lockedUntil };
  } else {
    // Just increment attempts
    await prisma.user.update({
      where: { id: userId },
      data: {
        failedLoginAttempts: newAttemptCount,
        lastFailedLoginAttempt: now,
      },
    });

    return { locked: false };
  }
}

export async function resetFailedLoginAttempts(
  prisma: PrismaClient,
  userId: string
): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: {
      failedLoginAttempts: 0,
      lastFailedLoginAttempt: null,
      lockedUntil: null,
    },
  });
}

export async function getRemainingAttempts(
  prisma: PrismaClient,
  userId: string
): Promise<number> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { failedLoginAttempts: true },
  });

  if (!user) {
    return BRUTE_FORCE_CONFIG.MAX_FAILED_ATTEMPTS;
  }

  const usedAttempts = user.failedLoginAttempts || 0;
  return Math.max(0, BRUTE_FORCE_CONFIG.MAX_FAILED_ATTEMPTS - usedAttempts);
}

