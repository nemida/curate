import { config } from "dotenv"
config({ path: ".env.local" })

import bcrypt from "bcryptjs"

async function seed() {
  const { db } = await import("./db")
  const { users, blogs, readingList, blogLikes, tags, blogTags, comments, follows } = await import("./db/schema")

  console.log("Clearing database...")
  await db.delete(comments)
  await db.delete(blogLikes)
  await db.delete(blogTags)
  await db.delete(readingList)
  await db.delete(follows)
  await db.delete(blogs)
  await db.delete(tags)
  await db.delete(users)

  console.log("Creating users...")
  const password = await bcrypt.hash("password123", 10)

  const [alice, bob, carol, dan, eve] = await db.insert(users).values([
    { username: "alice",  name: "Alice Johnson",   passwordHash: password },
    { username: "bob",    name: "Bob Smith",        passwordHash: password },
    { username: "carol",  name: "Carol Williams",   passwordHash: password },
    { username: "dan",    name: "Dan Park",         passwordHash: password },
    { username: "eve",    name: "Eve Martinez",     passwordHash: password },
  ]).returning()

  console.log("Creating tags...")
  const tagNames = ["react", "nextjs", "typescript", "css", "postgresql", "devops", "javascript", "career", "tooling", "performance"]
  const insertedTags = await db.insert(tags).values(tagNames.map(name => ({ name }))).returning()
  const tagMap = Object.fromEntries(insertedTags.map(t => [t.name, t.id]))

  console.log("Creating blogs...")
  const insertedBlogs = await db.insert(blogs).values([
    {
      title: "Understanding React Server Components",
      author: "Alice Johnson",
      url: "https://react.dev",
      content: `## What are Server Components?\n\nReact Server Components (RSC) let you render components exclusively on the server. Unlike traditional SSR, they don't send any JavaScript to the client.\n\n### Benefits\n\n- **Zero client-side JS** for server components\n- Direct database access without an API layer\n- Smaller client bundles\n\n### When to use them\n\nUse Server Components for anything that reads data — layouts, pages, data-fetching wrappers. Switch to \`"use client"\` only when you need interactivity, state, or browser APIs.\n\n\`\`\`tsx\nconst Page = async () => {\n  const data = await db.query.posts.findMany()\n  return <PostList posts={data} />\n}\n\`\`\`\n\nThis runs entirely on the server. No useEffect, no loading spinners, no client bundle overhead.`,
      userId: alice.id,
    },
    {
      title: "Why TypeScript is Worth the Friction",
      author: "Alice Johnson",
      url: "https://www.typescriptlang.org",
      content: `## The case for TypeScript\n\nEveryone who starts TypeScript goes through the same arc: frustration → grudging acceptance → never going back.\n\n### What you actually get\n\n1. **Autocomplete that works** — your editor knows the shape of every object\n2. **Refactoring confidence** — rename a field and TypeScript shows every callsite that breaks\n3. **Documentation that can't lie** — types are always in sync with the code\n\n### The friction is the point\n\nWhen TypeScript complains, it's usually right. That error you're fighting is a bug you haven't written yet.\n\n> The best time to add TypeScript was at the start of the project. The second best time is now.`,
      userId: alice.id,
    },
    {
      title: "Tailwind CSS: Utility-First Done Right",
      author: "Bob Smith",
      url: "https://tailwindcss.com",
      content: `## Why utility-first CSS works\n\nI was skeptical of Tailwind for a long time. "Why would I write \`flex items-center justify-between\` in my HTML when I could just write \`.navbar\` in CSS?"\n\nThen I tried it on a real project.\n\n### What changes\n\n- You stop context-switching between HTML and CSS files\n- You stop naming things (the hardest problem in CSS)\n- You stop worrying about cascade conflicts\n\n### The real benefit: constraints\n\nTailwind's design tokens — spacing scale, color palette, typography — force consistency. Every team member is pulling from the same set of values.\n\n\`\`\`html\n<div class="flex items-center gap-4 p-6 rounded-lg bg-card shadow-sm">\n  <Avatar />\n  <UserInfo />\n</div>\n\`\`\`\n\nThis is readable. You can see the layout at a glance.`,
      userId: bob.id,
    },
    {
      title: "Next.js App Router: The Mental Model",
      author: "Bob Smith",
      url: "https://nextjs.org/docs/app",
      content: `## Rethinking how pages work\n\nThe App Router isn't just a new file structure — it's a different mental model for how React apps are built.\n\n### The key shift\n\n**Pages Router:** Components run on the client. Data fetching is a special lifecycle (getServerSideProps, getStaticProps).\n\n**App Router:** Components run on the server by default. Data fetching is just \`async/await\`.\n\n### Layouts that don't re-render\n\nThe biggest practical win is nested layouts. Your sidebar, navbar, and shell render once and persist across navigations — no flicker, no re-mount.\n\n\`\`\`\napp/\n  layout.tsx        ← renders once\n  page.tsx          ← swaps on navigation\n  dashboard/\n    layout.tsx      ← nested shell\n    page.tsx\n\`\`\`\n\n### Colocate everything\n\nComponents, actions, and tests can live next to the route that uses them. No more hunting through \`/components\` for a component that's only used in one place.`,
      userId: bob.id,
    },
    {
      title: "PostgreSQL Query Optimization: A Practical Guide",
      author: "Carol Williams",
      url: "https://www.postgresql.org/docs",
      content: `## Making slow queries fast\n\nMost slow queries have one of three causes: missing indexes, fetching too many rows, or N+1 query patterns.\n\n### Step 1: EXPLAIN ANALYZE\n\nAlways start here. Never guess.\n\n\`\`\`sql\nEXPLAIN ANALYZE\nSELECT * FROM blogs\nWHERE user_id = 42\nORDER BY created_at DESC;\n\`\`\`\n\nLook for **Seq Scan** on large tables — that's your first target.\n\n### Step 2: Add the right indexes\n\n\`\`\`sql\nCREATE INDEX idx_blogs_user_id ON blogs(user_id);\nCREATE INDEX idx_blogs_created_at ON blogs(created_at DESC);\n\`\`\`\n\n### Step 3: Avoid SELECT *\n\nFetch only the columns you need. On wide tables this makes a significant difference.\n\n### N+1 is the silent killer\n\nIf you're running one query per item in a list, you have an N+1 problem. Use JOINs or batch fetching instead.`,
      userId: carol.id,
    },
    {
      title: "Drizzle ORM vs Prisma: An Honest Comparison",
      author: "Carol Williams",
      url: "https://orm.drizzle.team",
      content: `## Choosing your ORM\n\nBoth are excellent. The right choice depends on what you value.\n\n### Prisma\n\n**Strengths:**\n- Excellent DX and autocomplete\n- Prisma Studio for visual DB browsing\n- Large community and ecosystem\n\n**Weaknesses:**\n- Query engine is a separate binary (cold start issues on serverless)\n- Less control over raw SQL\n- Migrations can be opinionated\n\n### Drizzle\n\n**Strengths:**\n- Pure TypeScript, no binary — perfect for serverless/edge\n- SQL-like query API means no surprises\n- Lightweight and fast\n\n**Weaknesses:**\n- Smaller community\n- Less magic (which is also a strength)\n\n### My take\n\nFor serverless deployments (Vercel, Cloudflare Workers), Drizzle wins on cold start performance alone. For teams that want maximum DX and aren't on serverless, Prisma is still great.`,
      userId: carol.id,
    },
    {
      title: "CSS Grid Is Underrated",
      author: "Bob Smith",
      url: "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout",
      content: `## Stop reaching for Flexbox every time\n\nFlexbox is one-dimensional. Grid is two-dimensional. Most layouts are two-dimensional.\n\n### The layout that changed my mind\n\n\`\`\`css\n.dashboard {\n  display: grid;\n  grid-template-columns: 240px 1fr;\n  grid-template-rows: 60px 1fr;\n  height: 100vh;\n}\n\`\`\`\n\nSidebar, header, content — three lines. No wrappers, no nesting, no math.\n\n### When to use each\n\n- **Flexbox:** One axis, dynamic content, component internals\n- **Grid:** Page layout, card grids, anything two-dimensional\n\n### Grid areas are readable\n\n\`\`\`css\ngrid-template-areas:\n  "header header"\n  "sidebar main";\n\`\`\`\n\nYou can literally see the layout in the CSS.`,
      userId: bob.id,
    },
    {
      title: "How I Structure a Next.js Project",
      author: "Dan Park",
      url: null,
      content: `## Structure that scales\n\nAfter building a dozen Next.js apps, this is the folder structure I keep coming back to.\n\n\`\`\`\napp/\n  (routes)/\n  actions/       ← server actions by domain\n  components/    ← shared UI components\n  services/      ← data access layer\ncomponents/\n  ui/            ← shadcn primitives\ndb/\n  schema.ts\n  index.ts\n\`\`\`\n\n### The key principle\n\nKeep your data access in \`services/\`, your mutations in \`actions/\`, and your UI in components. Never query the database from a component directly.\n\n### Colocate route-specific code\n\nIf a component is only used by one route, put it next to that route. Only promote it to \`app/components/\` when it's used in two or more places.`,
      userId: dan.id,
    },
    {
      title: "Junior to Mid: What Actually Changes",
      author: "Dan Park",
      url: null,
      content: `## The real difference isn't technical\n\nEveryone thinks the junior → mid transition is about learning more technologies. It's not.\n\n### What actually changes\n\n**Juniors** ask "how do I do this?"\n**Mids** ask "should we do this?"\n\n### The skills that matter\n\n1. **Reading code** — you spend more time reading than writing\n2. **Breaking down problems** — splitting a feature into tasks before touching the keyboard\n3. **Knowing when to ask** — not too early (try first), not too late (don't waste a day)\n4. **Writing boring code** — clever code is hard to maintain; boring code is easy to debug\n\n### The timeline\n\nMost people hit mid-level between 18 months and 3 years. But it's not time — it's the quality of problems you've worked through.`,
      userId: dan.id,
    },
    {
      title: "Vim Motions Changed How I Think About Editing",
      author: "Eve Martinez",
      url: null,
      content: `## You don't need to switch to Vim\n\nEvery major editor has a Vim plugin. VSCode has VSCodeVim. JetBrains has IdeaVim. You get the motions without giving up your setup.\n\n### The motions worth learning first\n\n| Motion | What it does |\n|--------|-------------|\n| \`ciw\` | Change inside word |\n| \`di"\` | Delete inside quotes |\n| \`yap\` | Yank a paragraph |\n| \`%\` | Jump to matching bracket |\n| \`*\` | Search for word under cursor |\n\n### Why it's worth it\n\nAfter a few weeks of muscle memory, you stop thinking about *how* to edit and start thinking only about *what* to change. The editor gets out of the way.\n\n### The learning curve\n\nTwo weeks of feeling slow. Then you're faster than you were before. Then you can never go back.`,
      userId: eve.id,
    },
    {
      title: "Git Workflows for Small Teams",
      author: "Eve Martinez",
      url: null,
      content: `## You don't need GitFlow\n\nGitFlow was designed for teams shipping scheduled releases. If you're deploying continuously, it's overkill.\n\n### Trunk-based development\n\nEveryone works off \`main\`. Short-lived feature branches (1-2 days max), merged via PR.\n\n**Rules:**\n1. Branches live for less than 2 days\n2. Every merge to main deploys to staging automatically\n3. Main is always deployable\n\n### Commit messages that help future you\n\n\`\`\`\nfeat: add tag filtering to blogs list\nfix: prevent duplicate likes from same user\nrefactor: extract tag sync logic to service layer\n\`\`\`\n\nConventional commits + a good CI pipeline = a changelog you didn't have to write manually.\n\n### The only branching rule that matters\n\nNever commit directly to main. Everything else is negotiable.`,
      userId: eve.id,
    },
    {
      title: "Building for Performance From Day One",
      author: "Alice Johnson",
      url: null,
      content: `## Performance is a feature\n\nUsers won't complain about performance until it's bad. By then it's expensive to fix.\n\n### The easy wins\n\n1. **Images** — use next/image, specify dimensions, use WebP\n2. **Fonts** — self-host or use next/font, never block render\n3. **Client JS** — every \`"use client"\` is a bundle cost. Justify it.\n4. **Database queries** — add indexes before launch, not after\n\n### Measure first\n\nDon't optimize blind. Use Lighthouse, use the Network tab, use EXPLAIN ANALYZE on slow queries.\n\n### The 80/20 of web performance\n\n- Serve from a CDN\n- Lazy load images below the fold\n- Don't block the main thread\n- Cache aggressively, invalidate precisely\n\nMost sites don't need exotic optimization. They need these four things done well.`,
      userId: alice.id,
    },
  ]).returning()

  console.log("Adding tags to blogs...")
  const blogTagData = [
    { blog: insertedBlogs[0],  tagNames: ["react", "javascript", "performance"] },
    { blog: insertedBlogs[1],  tagNames: ["typescript", "javascript"] },
    { blog: insertedBlogs[2],  tagNames: ["css", "tooling"] },
    { blog: insertedBlogs[3],  tagNames: ["nextjs", "react"] },
    { blog: insertedBlogs[4],  tagNames: ["postgresql", "performance"] },
    { blog: insertedBlogs[5],  tagNames: ["postgresql", "tooling"] },
    { blog: insertedBlogs[6],  tagNames: ["css"] },
    { blog: insertedBlogs[7],  tagNames: ["nextjs", "javascript"] },
    { blog: insertedBlogs[8],  tagNames: ["career"] },
    { blog: insertedBlogs[9],  tagNames: ["tooling", "career"] },
    { blog: insertedBlogs[10], tagNames: ["devops", "tooling"] },
    { blog: insertedBlogs[11], tagNames: ["performance", "javascript"] },
  ]

  for (const { blog, tagNames: names } of blogTagData) {
    for (const name of names) {
      await db.insert(blogTags).values({ blogId: blog.id, tagId: tagMap[name] })
    }
  }

  console.log("Adding likes...")
  const likeData = [
    { userId: bob.id,   blogId: insertedBlogs[0].id },
    { userId: carol.id, blogId: insertedBlogs[0].id },
    { userId: dan.id,   blogId: insertedBlogs[0].id },
    { userId: eve.id,   blogId: insertedBlogs[0].id },
    { userId: alice.id, blogId: insertedBlogs[3].id },
    { userId: carol.id, blogId: insertedBlogs[3].id },
    { userId: eve.id,   blogId: insertedBlogs[3].id },
    { userId: alice.id, blogId: insertedBlogs[5].id },
    { userId: bob.id,   blogId: insertedBlogs[5].id },
    { userId: dan.id,   blogId: insertedBlogs[5].id },
    { userId: alice.id, blogId: insertedBlogs[4].id },
    { userId: bob.id,   blogId: insertedBlogs[4].id },
    { userId: eve.id,   blogId: insertedBlogs[4].id },
    { userId: carol.id, blogId: insertedBlogs[1].id },
    { userId: dan.id,   blogId: insertedBlogs[1].id },
    { userId: alice.id, blogId: insertedBlogs[7].id },
    { userId: eve.id,   blogId: insertedBlogs[7].id },
    { userId: bob.id,   blogId: insertedBlogs[8].id },
    { userId: carol.id, blogId: insertedBlogs[8].id },
    { userId: alice.id, blogId: insertedBlogs[9].id },
    { userId: carol.id, blogId: insertedBlogs[11].id },
    { userId: dan.id,   blogId: insertedBlogs[11].id },
  ]
  await db.insert(blogLikes).values(likeData)

  console.log("Adding follows...")
  await db.insert(follows).values([
    { followerId: alice.id, followingId: bob.id },
    { followerId: alice.id, followingId: carol.id },
    { followerId: bob.id,   followingId: alice.id },
    { followerId: bob.id,   followingId: dan.id },
    { followerId: carol.id, followingId: alice.id },
    { followerId: carol.id, followingId: eve.id },
    { followerId: dan.id,   followingId: eve.id },
    { followerId: dan.id,   followingId: bob.id },
    { followerId: eve.id,   followingId: alice.id },
    { followerId: eve.id,   followingId: carol.id },
  ])

  console.log("Adding comments...")
  await db.insert(comments).values([
    { userId: bob.id,   blogId: insertedBlogs[0].id, content: "Great writeup. The part about zero client-side JS was the thing that finally made RSC click for me." },
    { userId: carol.id, blogId: insertedBlogs[0].id, content: "Wish I had this when I first started with the App Router. Bookmarking." },
    { userId: dan.id,   blogId: insertedBlogs[0].id, content: "The code example at the end is exactly what I needed to see." },
    { userId: alice.id, blogId: insertedBlogs[3].id, content: "The nested layouts section is the most underrated part of this post. That feature alone saves so much work." },
    { userId: eve.id,   blogId: insertedBlogs[3].id, content: "Migrating from Pages to App Router was painful but worth it. This captures why." },
    { userId: alice.id, blogId: insertedBlogs[5].id, content: "The serverless cold start point is huge. That's what pushed us to Drizzle at work." },
    { userId: dan.id,   blogId: insertedBlogs[5].id, content: "Fair comparison. I've used both and agree with your conclusion." },
    { userId: bob.id,   blogId: insertedBlogs[4].id, content: "EXPLAIN ANALYZE should be required reading for every backend dev. So many people skip this step." },
    { userId: eve.id,   blogId: insertedBlogs[4].id, content: "The N+1 section is so important. I see this mistake constantly in code reviews." },
    { userId: carol.id, blogId: insertedBlogs[8].id, content: "\"Juniors ask how, mids ask should\" is the most concise way I've heard this put. Sharing this with my team." },
    { userId: alice.id, blogId: insertedBlogs[8].id, content: "The part about boring code resonated. I spent too long early on trying to write clever solutions." },
    { userId: carol.id, blogId: insertedBlogs[9].id, content: "ciw changed my editing life. I don't even think about it anymore, it's muscle memory." },
    { userId: bob.id,   blogId: insertedBlogs[10].id, content: "Trunk-based dev is the way. The moment a team adopts it, the merge conflict drama disappears." },
    { userId: dan.id,   blogId: insertedBlogs[11].id, content: "\"Cache aggressively, invalidate precisely\" should be on a poster." },
  ])

  console.log("Adding reading list entries...")
  await db.insert(readingList).values([
    { userId: alice.id, blogId: insertedBlogs[0].id,  read: true },
    { userId: alice.id, blogId: insertedBlogs[1].id,  read: true },
    { userId: alice.id, blogId: insertedBlogs[11].id, read: false },
    { userId: alice.id, blogId: insertedBlogs[3].id,  read: true },
    { userId: alice.id, blogId: insertedBlogs[5].id,  read: false },
    { userId: bob.id,   blogId: insertedBlogs[2].id,  read: true },
    { userId: bob.id,   blogId: insertedBlogs[3].id,  read: true },
    { userId: bob.id,   blogId: insertedBlogs[6].id,  read: false },
    { userId: bob.id,   blogId: insertedBlogs[0].id,  read: true },
    { userId: bob.id,   blogId: insertedBlogs[4].id,  read: false },
    { userId: carol.id, blogId: insertedBlogs[4].id,  read: true },
    { userId: carol.id, blogId: insertedBlogs[5].id,  read: true },
    { userId: carol.id, blogId: insertedBlogs[3].id,  read: false },
    { userId: carol.id, blogId: insertedBlogs[1].id,  read: false },
    { userId: dan.id,   blogId: insertedBlogs[7].id,  read: true },
    { userId: dan.id,   blogId: insertedBlogs[8].id,  read: true },
    { userId: dan.id,   blogId: insertedBlogs[0].id,  read: false },
    { userId: eve.id,   blogId: insertedBlogs[9].id,  read: true },
    { userId: eve.id,   blogId: insertedBlogs[10].id, read: true },
    { userId: eve.id,   blogId: insertedBlogs[11].id, read: false },
  ])

  console.log("\nDone! Seeded:")
  console.log("  5 users — alice, bob, carol, dan, eve (password: password123)")
  console.log(`  ${insertedBlogs.length} blogs with markdown content`)
  console.log("  10 tag types, applied across all blogs")
  console.log(`  ${likeData.length} likes`)
  console.log("  10 follows")
  console.log("  14 comments")
  console.log("  20 reading list entries")
}

seed().catch(console.error).finally(() => process.exit(0))
