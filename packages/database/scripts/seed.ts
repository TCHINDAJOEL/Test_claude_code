import { PrismaClient } from "../generated/prisma";
import { ulid } from "ulid";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  // Clean existing data
  console.log("🧹 Cleaning existing test data...");

  const existingUser = await prisma.user.findUnique({
    where: { email: "help@saveit.now" },
  });

  if (existingUser) {
    await prisma.user.delete({
      where: { email: "help@saveit.now" },
    });
    console.log("   Deleted existing test user and related data");
  }

  // Create test user with special email that has fixed OTP (123456)
  console.log("👤 Creating test user...");
  const userId = ulid();
  const user = await prisma.user.create({
    data: {
      id: userId,
      name: "Test User",
      email: "help@saveit.now",
      emailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      onboarding: true,
    },
  });

  console.log(`✅ User created: ${user.email} (ID: ${user.id})`);

  // Create a session for the test user (valid for 20 days)
  console.log("🔐 Creating active session...");
  const sessionToken = ulid();
  const session = await prisma.session.create({
    data: {
      id: ulid(),
      userId: user.id,
      token: sessionToken,
      expiresAt: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // 20 days
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  console.log(`✅ Session created (token: ${sessionToken})`);

  // Create tags
  console.log("🏷️  Creating tags...");
  const tags = await Promise.all([
    prisma.tag.create({
      data: {
        name: "Development",
        userId: user.id,
        type: "USER",
      },
    }),
    prisma.tag.create({
      data: {
        name: "Design",
        userId: user.id,
        type: "USER",
      },
    }),
    prisma.tag.create({
      data: {
        name: "AI",
        userId: user.id,
        type: "IA",
      },
    }),
    prisma.tag.create({
      data: {
        name: "Tutorial",
        userId: user.id,
        type: "USER",
      },
    }),
  ]);

  console.log(`✅ Created ${tags.length} tags`);

  // Create bookmarks
  console.log("🔖 Creating bookmarks...");
  const bookmarks = [
    {
      url: "https://nextjs.org/docs",
      title: "Next.js Documentation",
      type: "ARTICLE" as const,
      summary: "Official Next.js documentation for building web applications",
      status: "READY" as const,
      starred: true,
      read: false,
      tagNames: ["Development"],
    },
    {
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      title: "Amazing Tutorial Video",
      type: "YOUTUBE" as const,
      summary: "A comprehensive tutorial on web development",
      status: "READY" as const,
      starred: false,
      read: false,
      tagNames: ["Development", "Tutorial"],
    },
    {
      url: "https://dribbble.com/shots/popular",
      title: "Dribbble - Popular Shots",
      type: "PAGE" as const,
      summary: "Discover the world's top designers & creatives",
      status: "READY" as const,
      starred: true,
      read: true,
      tagNames: ["Design"],
    },
    {
      url: "https://anthropic.com/claude",
      title: "Claude AI by Anthropic",
      type: "ARTICLE" as const,
      summary: "Meet Claude, an AI assistant by Anthropic",
      status: "READY" as const,
      starred: false,
      read: false,
      tagNames: ["AI", "Development"],
    },
    {
      url: "https://example.com/pending",
      title: "Pending Article",
      type: "ARTICLE" as const,
      summary: null,
      status: "PENDING" as const,
      starred: false,
      read: false,
      tagNames: [],
    },
    {
      url: "https://github.com/vercel/next.js",
      title: "Next.js GitHub Repository",
      type: "PAGE" as const,
      summary: "The React Framework for the Web",
      status: "READY" as const,
      starred: true,
      read: false,
      tagNames: ["Development"],
    },
  ];

  for (const bookmarkData of bookmarks) {
    const bookmark = await prisma.bookmark.create({
      data: {
        id: ulid(),
        userId: user.id,
        url: bookmarkData.url,
        title: bookmarkData.title,
        type: bookmarkData.type,
        summary: bookmarkData.summary,
        status: bookmarkData.status,
        starred: bookmarkData.starred,
        read: bookmarkData.read,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Link tags to bookmark
    for (const tagName of bookmarkData.tagNames) {
      const tag = tags.find((t) => t.name === tagName);
      if (tag) {
        await prisma.bookmarkTag.create({
          data: {
            bookmarkId: bookmark.id,
            tagId: tag.id,
          },
        });
      }
    }

    console.log(`  ✅ Created bookmark: ${bookmark.title}`);
  }

  console.log(`✅ Created ${bookmarks.length} bookmarks`);

  // Create subscription (optional)
  console.log("💳 Creating free subscription...");
  await prisma.subscription.create({
    data: {
      id: ulid(),
      plan: "free",
      referenceId: user.id,
      status: "active",
      periodStart: new Date(),
      periodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
      cancelAtPeriodEnd: false,
    },
  });

  console.log("✅ Subscription created");

  console.log("\n✨ Seeding completed successfully!");
  console.log("\n📝 Test credentials:");
  console.log("   Email: help@saveit.now");
  console.log("   OTP Code: 123456 (fixed for this email)");
  console.log("\n   Auth method: Email OTP");
  console.log("   1. Go to the sign-in page");
  console.log("   2. Enter email: help@saveit.now");
  console.log("   3. Enter OTP code: 123456");
  console.log("\n   For development, you can also use the session token:");
  console.log(`   Session token: ${sessionToken}`);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
