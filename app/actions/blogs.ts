"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { addBlog, persistLikes } from "../services/blogs";
import { addToReadingList } from "../services/readingList";
import { auth } from "@/auth";

export const createBlog = async (
  prevState: {
    error: string;
    values?: {
      title?: string;
      author?: string;
      url?: string;
    };
  },
  formData: FormData,
) => {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  const title = formData.get("title") as string;
  const author = formData.get("author") as string;
  const url = formData.get("url") as string;

  if (
    !title ||
    title.length < 5 ||
    !author ||
    author.length < 5 ||
    !url ||
    url.length < 5
  ) {
    return {
      error: "Title, Author, URL must be 5 characters long.",
      values: { title, author, url },
      success: false,
    };
  }

  const result = await addBlog(title, author, url);
  await addToReadingList(result.userId, result.blogId);
  revalidatePath("/blogs");
  return { error: "", success: true };
};

export const increaseLikes = async (formData: FormData) => {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  const rawId = formData.get("id");
  const id = Number(rawId);
  await persistLikes(id);
  revalidatePath(`/blogs/${id}`);
};
