import { db } from "@/db";
import { blogs, blogLikes, blogTags, tags } from "@/db/schema";
import { eq, ilike, and, count, sql } from "drizzle-orm";
import { getCurrentUser } from "./session";

const PAGE_SIZE = 10;

export const getBlogs = async (filter?: string, tag?: string, page = 1) => {
  let tagBlogIds: number[] | undefined;
  if (tag) {
    const rows = await db
      .select({ blogId: blogTags.blogId })
      .from(blogTags)
      .innerJoin(tags, eq(tags.id, blogTags.tagId))
      .where(eq(tags.name, tag.toLowerCase()));
    tagBlogIds = rows.map((r) => r.blogId);
    if (tagBlogIds.length === 0) return { blogs: [], total: 0, pageSize: PAGE_SIZE };
  }

  const offset = (page - 1) * PAGE_SIZE;

  const [{ total }] = await db
    .select({ total: count() })
    .from(blogs)
    .where((b) => {
      const conditions = [];
      if (filter) conditions.push(ilike(b.title, `%${filter}%`));
      if (tagBlogIds) conditions.push(sql`${b.id} = ANY(ARRAY[${sql.join(tagBlogIds.map(id => sql`${id}`), sql`, `)}]::int[])`);
      return conditions.length > 0 ? and(...conditions) : undefined;
    });

  const likeCountSq = db
    .select({ blogId: blogLikes.blogId, likeCount: count().as("like_count") })
    .from(blogLikes)
    .groupBy(blogLikes.blogId)
    .as("like_counts");

  const rows = await db.query.blogs.findMany({
    where: (b, { and: qAnd, ilike: qIlike }) => {
      const conditions = [];
      if (filter) conditions.push(qIlike(b.title, `%${filter}%`));
      if (tagBlogIds) conditions.push(sql`${b.id} = ANY(ARRAY[${sql.join(tagBlogIds.map(id => sql`${id}`), sql`, `)}]::int[])`);
      return conditions.length > 0 ? qAnd(...conditions) : undefined;
    },
    with: {
      blogLikes: true,
      blogTags: { with: { tag: true } },
    },
    limit: PAGE_SIZE,
    offset,
  });

  const sorted = [...rows].sort((a, b) => b.blogLikes.length - a.blogLikes.length);

  return { blogs: sorted, total, pageSize: PAGE_SIZE };
}

export const getBlogById = async (id: number) => {
  return db.query.blogs.findFirst({
    where: eq(blogs.id, id),
    with: {
      blogLikes: true,
      blogTags: { with: { tag: true } },
      comments: {
        with: {
          user: { columns: { id: true, name: true, username: true } },
        },
        orderBy: (c, { asc }) => [asc(c.createdAt)],
      },
    },
  });
}

export const addBlog = async (title: string, author: string, url: string | null, content: string | null) => {
  const user = await getCurrentUser()

  if (!user) throw new Error("Not logged in");

  const [blog] = await db.insert(blogs).values({ title, author, url, content, userId: user.id }).returning({ id: blogs.id });
  return { blogId: blog.id, userId: user.id };
}

export const getLikeCount = async (blogId: number): Promise<number> => {
  const [result] = await db
    .select({ value: count() })
    .from(blogLikes)
    .where(eq(blogLikes.blogId, blogId));
  return result?.value ?? 0;
}

export const hasLiked = async (userId: number, blogId: number): Promise<boolean> => {
  const existing = await db.query.blogLikes.findFirst({
    where: and(eq(blogLikes.userId, userId), eq(blogLikes.blogId, blogId)),
  });
  return !!existing;
}

export const toggleLike = async (userId: number, blogId: number): Promise<"liked" | "unliked"> => {
  const existing = await db.query.blogLikes.findFirst({
    where: and(eq(blogLikes.userId, userId), eq(blogLikes.blogId, blogId)),
  });

  if (existing) {
    await db.delete(blogLikes).where(
      and(eq(blogLikes.userId, userId), eq(blogLikes.blogId, blogId))
    );
    return "unliked";
  } else {
    await db.insert(blogLikes).values({ userId, blogId });
    return "liked";
  }
}

export const updateBlog = async (id: number, title: string, author: string, url: string | null, content: string | null) => {
  await db.update(blogs).set({ title, author, url, content }).where(eq(blogs.id, id));
}

export const deleteBlog = async (id: number) => {
  await db.delete(blogs).where(eq(blogs.id, id));
}
