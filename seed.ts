import { config } from "dotenv"
config({ path: ".env.local" })

import bcrypt from "bcryptjs"

async function seed() {
  const { db } = await import("./db")
  const { users, blogs, readingList } = await import("./db/schema")

  // Clear all data
  console.log("Clearing database...")
  await db.delete(readingList)
  await db.delete(blogs)
  await db.delete(users)

  // Create users
  console.log("Creating users...")
  const password = await bcrypt.hash("password123", 10)

  const [testuser, example1, example2] = await db.insert(users).values([
    { username: "testuser", name: "Test User", passwordHash: password },
    { username: "example1", name: "Example One", passwordHash: password },
    { username: "example2", name: "Example Two", passwordHash: password },
  ]).returning()

  // Create blogs
  console.log("Creating blogs...")
  const insertedBlogs = await db.insert(blogs).values([
    {
      title: "Understanding React Server Components",
      author: "Alice Johnson",
      url: "https://react.dev/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023",
      likes: 42,
      userId: testuser.id,
    },
    {
      title: "Why TypeScript is Worth It",
      author: "Test User",
      url: "https://www.typescriptlang.org/docs/handbook/intro.html",
      likes: 31,
      userId: testuser.id,
    },
    {
      title: "The Complete Guide to Tailwind CSS",
      author: "Example One",
      url: "https://tailwindcss.com/docs",
      likes: 58,
      userId: example1.id,
    },
    {
      title: "Next.js App Router: Everything You Need to Know",
      author: "Example One",
      url: "https://nextjs.org/docs/app",
      likes: 74,
      userId: example1.id,
    },
    {
      title: "PostgreSQL Performance Tips",
      author: "Example Two",
      url: "https://www.postgresql.org/docs/current/performance-tips.html",
      likes: 19,
      userId: example2.id,
    },
    {
      title: "Drizzle ORM: A Modern Alternative to Prisma",
      author: "Example Two",
      url: "https://orm.drizzle.team/docs/overview",
      likes: 37,
      userId: example2.id,
    },
    {
      title: "How to Design a REST API",
      author: "Test User",
      url: "https://restfulapi.net",
      likes: 23,
      userId: testuser.id,
    },
    {
      title: "CSS Grid vs Flexbox: When to Use Which",
      author: "Example One",
      url: "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout",
      likes: 45,
      userId: example1.id,
    },
  ]).returning()

  // Create reading list entries
  console.log("Creating reading lists...")
  await db.insert(readingList).values([
    // TestUser's list
    { userId: testuser.id, blogId: insertedBlogs[0].id, read: true },
    { userId: testuser.id, blogId: insertedBlogs[1].id, read: true },
    { userId: testuser.id, blogId: insertedBlogs[6].id, read: false },
    { userId: testuser.id, blogId: insertedBlogs[2].id, read: true },
    { userId: testuser.id, blogId: insertedBlogs[3].id, read: false },

    // Example1's list
    { userId: example1.id, blogId: insertedBlogs[2].id, read: true },
    { userId: example1.id, blogId: insertedBlogs[3].id, read: true },
    { userId: example1.id, blogId: insertedBlogs[7].id, read: false },
    { userId: example1.id, blogId: insertedBlogs[0].id, read: true },
    { userId: example1.id, blogId: insertedBlogs[5].id, read: false },

    // Example2's list
    { userId: example2.id, blogId: insertedBlogs[4].id, read: true },
    { userId: example2.id, blogId: insertedBlogs[5].id, read: false },
    { userId: example2.id, blogId: insertedBlogs[3].id, read: true },
    { userId: example2.id, blogId: insertedBlogs[1].id, read: false },
  ])

  console.log("Done! Seeded:")
  console.log(`  ${3} users (testuser, example1, example2) — password: password123`)
  console.log(`  ${insertedBlogs.length} blogs`)
  console.log(`  14 reading list entries`)
}

seed().catch(console.error).finally(() => process.exit(0))
