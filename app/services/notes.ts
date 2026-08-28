import { db } from "@/db";
import { notes } from "@/db/schema";
import { eq, ilike, sql } from "drizzle-orm";



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
  await db.insert(notes).values({title, author, url, likes: 0});
}


export const persistLikes = async (id: number) => {
  await db.update(notes).set({ likes: sql`${notes.likes} + 1` }).where(eq(notes.id, id));
}
