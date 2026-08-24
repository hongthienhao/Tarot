import prisma from './src/config/prismaClient.js';

async function fixRoles() {
  // Reset all to USER
  await prisma.user.updateMany({
    data: { role: 'USER' },
  });

  // Set only honguyenthienhao@gmail.com as ADMIN
  const res = await prisma.user.updateMany({
    where: { email: 'honguyenthienhao@gmail.com' },
    data: { role: 'ADMIN' },
  });

  console.log('✅ Set ADMIN for honguyenthienhao@gmail.com:', res.count);

  const allUsers = await prisma.user.findMany({
    select: { email: true, role: true },
  });
  console.log('Final DB state:', allUsers);

  await prisma.$disconnect();
}

fixRoles();
