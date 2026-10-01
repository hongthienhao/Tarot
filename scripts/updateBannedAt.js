import prisma from '../src/config/prismaClient.js';

async function updateBannedAt() {
  const res = await prisma.user.updateMany({
    where: { isBanned: true, bannedAt: null },
    data: { bannedAt: new Date() },
  });
  console.log('Updated bannedAt for users:', res.count);
  await prisma.$disconnect();
}

updateBannedAt();
