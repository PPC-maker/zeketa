import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('Admin123!', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@zeketa.com' },
    update: {},
    create: {
      email: 'admin@zeketa.com',
      passwordHash: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      isActive: true,
    },
  });

  console.log('Created admin user:', admin.email);

  // Create base categories
  const menCategory = await prisma.category.upsert({
    where: { slug: 'men' },
    update: {},
    create: {
      nameHe: 'גברים',
      nameEn: 'Men',
      slug: 'men',
      isActive: true,
      sortOrder: 1,
    },
  });

  const womenCategory = await prisma.category.upsert({
    where: { slug: 'women' },
    update: {},
    create: {
      nameHe: 'נשים',
      nameEn: 'Women',
      slug: 'women',
      isActive: true,
      sortOrder: 2,
    },
  });

  console.log('Created categories:', menCategory.slug, womenCategory.slug);

  console.log('Seeding complete!');
  console.log('');
  console.log('=================================');
  console.log('Admin Login Credentials:');
  console.log('Email: admin@zeketa.com');
  console.log('Password: Admin123!');
  console.log('=================================');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
