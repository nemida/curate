"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "../services/session";
import { addToReadingList, markAsRead } from "../services/readingList";

export const addToReadingListAction = async (formData: FormData) => {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const blogId = Number(formData.get("blogId"));
  await addToReadingList(user.id, blogId);
  revalidatePath("/me");
};

export const markAsReadAction = async (formData: FormData) => {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const entryId = Number(formData.get("entryId"));
  await markAsRead(entryId, user.id);
  revalidatePath("/me");
};
