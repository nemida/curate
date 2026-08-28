import { db } from "@/db";
import { notes } from "@/db/schema";
import { eq } from "drizzle-orm";



export const getNotes = async () => {
  return db.query.notes.findMany();
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
  const note = await db.query.notes.findFirst({
    where: eq(notes.id, id),
  });

  if (note) {
    await db.update(notes).set({likes: note.likes + 1}).where(eq(notes.id, id));
  }
}
