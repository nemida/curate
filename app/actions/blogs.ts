"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { addBlog, persistLikes, getBlogById, updateBlog, deleteBlog } from "../services/blogs";
import { addToReadingList } from "../services/readingList";
import { auth } from "@/auth";
import { getCurrentUser } from "../services/session";

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

export const editBlog = async (
  prevState: {
    error: string;
    values?: { title?: string; author?: string; url?: string };
    success: boolean;
  },
  formData: FormData,
) => {
  const session = await auth();
  if (!session) redirect("/login");

  const rawId = formData.get("id");
  const id = Number(rawId);
  const title = formData.get("title") as string;
  const author = formData.get("author") as string;
  const url = formData.get("url") as string;

  if (
    !title || title.length < 5 ||
    !author || author.length < 5 ||
    !url || url.length < 5
  ) {
    return {
      error: "Title, Author, URL must be at least 5 characters long.",
      values: { title, author, url },
      success: false,
    };
  }

  const blog = await getBlogById(id);
  if (!blog) return { error: "Blog not found.", success: false };

  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.id !== blog.userId) {
    return { error: "You are not the owner of this blog.", success: false };
  }

  await updateBlog(id, title, author, url);
  revalidatePath(`/blogs/${id}`);
  revalidatePath("/blogs");
  return { error: "", success: true };
};

export const deleteBlogAction = async (formData: FormData) => {
  const session = await auth();
  if (!session) redirect("/login");

  const rawId = formData.get("id");
  const id = Number(rawId);

  const blog = await getBlogById(id);
  if (!blog) redirect("/blogs");

  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.id !== blog.userId) {
    redirect(`/blogs/${id}`);
  }

  await deleteBlog(id);
  revalidatePath("/blogs");
  redirect("/blogs");
};
