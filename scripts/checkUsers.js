import prisma from '../src/config/prismaClient.js';

async function checkUsers() {
  const users = await prisma.user.findMany({
    select: { id: true, email: true, fullName: true, name: true, role: true, starPoints: true },
  });
  console.log('--- ALL USERS IN DB ---');
  console.log(JSON.stringify(users, null, 2));
  await prisma.$disconnect();
}

checkUsers();
