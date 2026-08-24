import prisma from './src/config/prismaClient.js';

async function syncBlacklist() {
  const bannedUsers = await prisma.user.findMany({
    where: { isBanned: true },
  });

  console.log('Found banned users:', bannedUsers.map(u => u.email));

  for (const u of bannedUsers) {
    const exists = await prisma.blacklist.findUnique({ where: { email: u.email } });
    if (!exists) {
      await prisma.blacklist.create({
        data: {
          email: u.email,
          reason: 'Khóa tài khoản bởi Quản Trị Viên',
          bannedBy: 'SYSTEM',
        },
      });
      console.log('Synced to Blacklist:', u.email);
    }
  }

  const currentBlacklist = await prisma.blacklist.findMany();
  console.log('Current Blacklist:', currentBlacklist);

  await prisma.$disconnect();
}

syncBlacklist();
