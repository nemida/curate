"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { addNote, persistLikes } from "../services/notes"
import { auth } from "@/auth"

export const createNote = async (formData: FormData) => {
  const session = await auth()
  if (!session) {
    redirect("/login")
  }


  const title = formData.get("title") as string;
  const author = formData.get("author") as string;
  const url = formData.get("url") as string;

  await addNote(title, author, url);
  revalidatePath("/notes");
  redirect("/notes");
} 

export const increaseLikes = async (formData: FormData) => {
  const rawId = formData.get("id");
  const id = Number(rawId);
  await persistLikes(id);
  revalidatePath(`/notes/${id}`);

}