"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "../services/session";
import { addComment, deleteComment } from "../services/comments";

export const addCommentAction = async (
  prevState: { error: string; success: boolean },
  formData: FormData,
) => {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const blogId = Number(formData.get("blogId"));
  const content = (formData.get("content") as string)?.trim();

  if (!content || content.length < 1) {
    return { error: "Comment cannot be empty.", success: false };
  }

  if (content.length > 1000) {
    return { error: "Comment must be 1000 characters or fewer.", success: false };
  }

  await addComment(user.id, blogId, content);
  revalidatePath(`/blogs/${blogId}`);
  return { error: "", success: true };
};

export const deleteCommentAction = async (formData: FormData) => {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const commentId = Number(formData.get("commentId"));
  const blogId = Number(formData.get("blogId"));

  await deleteComment(commentId, user.id);
  revalidatePath(`/blogs/${blogId}`);
};
