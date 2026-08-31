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

  const [alice, bob, carol] = await db.insert(users).values([
    { username: "alice", name: "Alice Johnson", passwordHash: password },
    { username: "bob", name: "Bob Smith", passwordHash: password },
    { username: "carol", name: "Carol Williams", passwordHash: password },
  ]).returning()

  // Create blogs
  console.log("Creating blogs...")
  const insertedBlogs = await db.insert(blogs).values([
    {
      title: "Understanding React Server Components",
      author: "Alice Johnson",
      url: "https://react.dev/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023",
      likes: 42,
      userId: alice.id,
    },
    {
      title: "Why TypeScript is Worth It",
      author: "Alice Johnson",
      url: "https://www.typescriptlang.org/docs/handbook/intro.html",
      likes: 31,
      userId: alice.id,
    },
    {
      title: "The Complete Guide to Tailwind CSS",
      author: "Bob Smith",
      url: "https://tailwindcss.com/docs",
      likes: 58,
      userId: bob.id,
    },
    {
      title: "Next.js App Router: Everything You Need to Know",
      author: "Bob Smith",
      url: "https://nextjs.org/docs/app",
      likes: 74,
      userId: bob.id,
    },
    {
      title: "PostgreSQL Performance Tips",
      author: "Carol Williams",
      url: "https://www.postgresql.org/docs/current/performance-tips.html",
      likes: 19,
      userId: carol.id,
    },
    {
      title: "Drizzle ORM: A Modern Alternative to Prisma",
      author: "Carol Williams",
      url: "https://orm.drizzle.team/docs/overview",
      likes: 37,
      userId: carol.id,
    },
    {
      title: "How to Design a REST API",
      author: "Alice Johnson",
      url: "https://restfulapi.net",
      likes: 23,
      userId: alice.id,
    },
    {
      title: "CSS Grid vs Flexbox: When to Use Which",
      author: "Bob Smith",
      url: "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout",
      likes: 45,
      userId: bob.id,
    },
  ]).returning()

  // Create reading list entries
  // Alice auto-added her own blogs (3), plus added some from others
  // Bob auto-added his own blogs (3), plus added some from others
  // Carol auto-added her own blogs (2), plus added some from others
  console.log("Creating reading lists...")
  await db.insert(readingList).values([
    // Alice's list: her own blogs (auto-added) + some from others
    { userId: alice.id, blogId: insertedBlogs[0].id, read: true },
    { userId: alice.id, blogId: insertedBlogs[1].id, read: true },
    { userId: alice.id, blogId: insertedBlogs[6].id, read: false },
    { userId: alice.id, blogId: insertedBlogs[2].id, read: true },  // Bob's
    { userId: alice.id, blogId: insertedBlogs[3].id, read: false }, // Bob's

    // Bob's list: his own blogs + some from others
    { userId: bob.id, blogId: insertedBlogs[2].id, read: true },
    { userId: bob.id, blogId: insertedBlogs[3].id, read: true },
    { userId: bob.id, blogId: insertedBlogs[7].id, read: false },
    { userId: bob.id, blogId: insertedBlogs[0].id, read: true },  // Alice's
    { userId: bob.id, blogId: insertedBlogs[5].id, read: false }, // Carol's

    // Carol's list: her own blogs + some from others
    { userId: carol.id, blogId: insertedBlogs[4].id, read: true },
    { userId: carol.id, blogId: insertedBlogs[5].id, read: false },
    { userId: carol.id, blogId: insertedBlogs[3].id, read: true },  // Bob's
    { userId: carol.id, blogId: insertedBlogs[1].id, read: false }, // Alice's
  ])

  console.log("Done! Seeded:")
  console.log(`  ${3} users (alice, bob, carol) — password: password123`)
  console.log(`  ${insertedBlogs.length} blogs`)
  console.log(`  14 reading list entries`)
}

seed().catch(console.error).finally(() => process.exit(0))