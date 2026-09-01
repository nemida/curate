import { db } from "@/db";
import { blogs } from "@/db/schema";
import { eq, ilike, sql } from "drizzle-orm";
import { getCurrentUser } from "./session";

export const getBlogs = async (filter?: string) => {
  return db.query.blogs.findMany({
    where: filter ? ilike(blogs.title, `%${filter}%`) : undefined,
  });
}

export const getBlogById = async (id: number) => {
  return db.query.blogs.findFirst({
    where: eq(blogs.id, id),
  });
}

export const addBlog = async (title: string, author: string, url: string) => {
  const user = await getCurrentUser()

  if (!user) throw new Error("Not logged in");

  const [blog] = await db.insert(blogs).values({ title, author, url, likes: 0, userId: user.id }).returning({ id: blogs.id });
  return { blogId: blog.id, userId: user.id };
}

export const persistLikes = async (id: number) => {
  await db.update(blogs).set({ likes: sql`${blogs.likes} + 1` }).where(eq(blogs.id, id));
}

export const updateBlog = async (id: number, title: string, author: string, url: string) => {
  await db.update(blogs).set({ title, author, url }).where(eq(blogs.id, id));
}

export const deleteBlog = async (id: number) => {
  await db.delete(blogs).where(eq(blogs.id, id));
}
