import { PrismaClient, Role } from '@prisma/client';
import { hashPassword } from '../src/utils/auth';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Get super admin credentials from environment variables
  const superAdminEmail = process.env.SUPER_ADMIN_EMAIL || 'admin@wallpapers.com';
  const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD || 'SuperAdmin123!';
  const superAdminName = process.env.SUPER_ADMIN_NAME || 'Super Admin';
  const superAdminUsername = process.env.SUPER_ADMIN_USERNAME || 'superadmin';

  // Validate required fields
  if (!superAdminEmail || !superAdminPassword) {
    throw new Error(
      'Super admin credentials not found in environment variables.\n' +
      'Please set SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD in your .env file.'
    );
  }

  // Hash the password
  const hashedPassword = await hashPassword(superAdminPassword);

  // Upsert super admin user
  const superAdmin = await prisma.user.upsert({
    where: {
      email: superAdminEmail,
    },
    update: {
      name: superAdminName,
      username: superAdminUsername,
      password: hashedPassword,
      role: Role.SUPER_ADMIN,
      isActive: true,
      isVerified: true,
      isBanned: false,
      bannedReason: null,
      bannedAt: null,
      bannedUntil: null,
    },
    create: {
      email: superAdminEmail,
      name: superAdminName,
      username: superAdminUsername,
      password: hashedPassword,
      role: Role.SUPER_ADMIN,
      isActive: true,
      isVerified: true,
      isBanned: false,
    },
  });

  console.log('✅ Super admin user created/updated:');
  console.log(`   Email: ${superAdmin.email}`);
  console.log(`   Username: ${superAdmin.username}`);
  console.log(`   Name: ${superAdmin.name}`);
  console.log(`   Role: ${superAdmin.role}`);
  console.log(`   ID: ${superAdmin.id}`);
  console.log('\n✨ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
