import { db } from "@/db";
import { notes } from "@/db/schema";
import { eq, ilike, sql } from "drizzle-orm";
import { getCurrentUser } from "./session";

export const getNotes = async (filter?: string) => {
  return db.query.notes.findMany({
    where: filter ? ilike(notes.title, `%${filter}%`) : undefined,
  });
}

export const getNoteById = async (id: number) => {
  return db.query.notes.findFirst({
    where: eq(notes.id, id),
  });
}

export const addNote = async (title: string, author: string, url: string) => {
  const user = await getCurrentUser()

  if (!user) throw new Error("Not logged in");

  const [note] = await db.insert(notes).values({ title, author, url, likes: 0, userId: user.id }).returning({ id: notes.id });
  return { noteId: note.id, userId: user.id };
}


export const persistLikes = async (id: number) => {
  await db.update(notes).set({ likes: sql`${notes.likes} + 1` }).where(eq(notes.id, id));
}
