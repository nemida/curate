import { db } from "@/db";
import { notes, users } from "@/db/schema";
import { eq } from "drizzle-orm";

export const getUsers = async () => {
  return db.query.users.findMany();
};

export const getUserWithNotes = async (id: number) => {
  return db.query.users.findFirst({
    where: eq(users.id, id),
    with: { notes: true },
  });
};

export const getUserById = async (id: number) => {
  return db.query.users.findFirst({
    where: eq(users.id, id),
  });
};

export const getNotesByUserId = async (userId: number) => {
  return db.query.notes.findMany({
    where: eq(notes.userId, userId),
  });
};
