"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { addNote, persistLikes } from "../services/notes"

export const createNote = async (formData: FormData) => {
  const title = formData.get("title") as string;
  const author = formData.get("author") as string;
  const url = formData.get("url") as string;

  addNote(title, author, url);
  revalidatePath("/notes");
  redirect("/notes");
} 

export const increaseLikes = async (formData: FormData) => {
  const rawId = formData.get("id");
  const id = Number(rawId);
  persistLikes(id);
  revalidatePath(`/notes/${id}`);

}