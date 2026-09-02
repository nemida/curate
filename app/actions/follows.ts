"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "../services/session";
import { toggleFollow } from "../services/follows";

export const toggleFollowAction = async (formData: FormData) => {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/login");

  const followingId = Number(formData.get("followingId"));
  const username = formData.get("username") as string;

  if (currentUser.id === followingId) return;

  await toggleFollow(currentUser.id, followingId);
  revalidatePath(`/users/${username}`);
  revalidatePath("/feed");
};
