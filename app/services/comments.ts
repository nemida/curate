import { db } from "@/db";
import { comments } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export const addComment = async (userId: number, blogId: number, content: string) => {
  const [comment] = await db
    .insert(comments)
    .values({ userId, blogId, content })
    .returning();
  return comment;
};

export const deleteComment = async (commentId: number, userId: number) => {
  await db
    .delete(comments)
    .where(and(eq(comments.id, commentId), eq(comments.userId, userId)));
};
