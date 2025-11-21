import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

async function checkData() {
  console.log("🔍 Checking database data...\n");

  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
    },
  });

  console.log(`👥 Users (${users.length}):`);
  users.forEach((user) => {
    console.log(`   - ${user.email} (${user.name}) - ID: ${user.id}`);
  });

  const bookmarks = await prisma.bookmark.findMany({
    select: {
      id: true,
      title: true,
      url: true,
      userId: true,
      status: true,
    },
  });

  console.log(`\n🔖 Bookmarks (${bookmarks.length}):`);
  bookmarks.forEach((bookmark) => {
    console.log(`   - ${bookmark.title} (${bookmark.status})`);
    console.log(`     User ID: ${bookmark.userId}`);
  });

  const tags = await prisma.tag.findMany({
    select: {
      id: true,
      name: true,
      userId: true,
      type: true,
    },
  });

  console.log(`\n🏷️  Tags (${tags.length}):`);
  tags.forEach((tag) => {
    console.log(`   - ${tag.name} (${tag.type})`);
  });

  const sessions = await prisma.session.findMany({
    select: {
      id: true,
      userId: true,
      token: true,
      expiresAt: true,
    },
  });

  console.log(`\n🔐 Sessions (${sessions.length}):`);
  sessions.forEach((session) => {
    const isExpired = session.expiresAt < new Date();
    console.log(`   - User: ${session.userId}`);
    console.log(`     Token: ${session.token}`);
    console.log(`     Expires: ${session.expiresAt} ${isExpired ? "(EXPIRED)" : "(VALID)"}`);
  });
}

checkData()
  .catch((e) => {
    console.error("❌ Error checking data:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
