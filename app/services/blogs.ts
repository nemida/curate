import { db } from "@/db";
import { blogs, blogLikes } from "@/db/schema";
import { eq, ilike, and, count } from "drizzle-orm";
import { getCurrentUser } from "./session";

export const getBlogs = async (filter?: string) => {
  return db.query.blogs.findMany({
    where: filter ? ilike(blogs.title, `%${filter}%`) : undefined,
    with: { blogLikes: true },
  });
}

export const getBlogById = async (id: number) => {
  return db.query.blogs.findFirst({
    where: eq(blogs.id, id),
    with: { blogLikes: true },
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
