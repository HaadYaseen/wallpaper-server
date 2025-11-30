import { prisma } from './prisma';

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

