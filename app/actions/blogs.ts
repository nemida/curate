"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { addBlog, toggleLike, getBlogById, updateBlog, deleteBlog } from "../services/blogs";
import { syncBlogTags } from "../services/tags";
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
      content?: string;
      tags?: string;
    };
    success?: boolean;
  },
  formData: FormData,
) => {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  const title = formData.get("title") as string;
  const author = formData.get("author") as string;
  const url = (formData.get("url") as string) || null;
  const content = (formData.get("content") as string) || null;
  const tagsRaw = (formData.get("tags") as string) || "";

  if (!title || title.length < 5 || !author || author.length < 5) {
    return {
      error: "Title and Author must be at least 5 characters long.",
      values: { title, author, url: url ?? "", content: content ?? "", tags: tagsRaw },
      success: false,
    };
  }

  const result = await addBlog(title, author, url, content);
  await syncBlogTags(result.blogId, tagsRaw.split(",").filter(Boolean));
  await addToReadingList(result.userId, result.blogId);
  revalidatePath("/blogs");
  return { error: "", success: true };
};

export const toggleLikeAction = async (formData: FormData) => {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/login");

  const id = Number(formData.get("id"));
  await toggleLike(currentUser.id, id);
  revalidatePath(`/blogs/${id}`);
  revalidatePath("/blogs");
};

export const editBlog = async (
  prevState: {
    error: string;
    values?: { title?: string; author?: string; url?: string; content?: string; tags?: string };
    success: boolean;
  },
  formData: FormData,
) => {
  const session = await auth();
  if (!session) redirect("/login");

  const id = Number(formData.get("id"));
  const title = formData.get("title") as string;
  const author = formData.get("author") as string;
  const url = (formData.get("url") as string) || null;
  const content = (formData.get("content") as string) || null;
  const tagsRaw = (formData.get("tags") as string) || "";

  if (!title || title.length < 5 || !author || author.length < 5) {
    return {
      error: "Title and Author must be at least 5 characters long.",
      values: { title, author, url: url ?? "", content: content ?? "", tags: tagsRaw },
      success: false,
    };
  }

  const blog = await getBlogById(id);
  if (!blog) return { error: "Blog not found.", success: false };

  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.id !== blog.userId) {
    return { error: "You are not the owner of this blog.", success: false };
  }

  await updateBlog(id, title, author, url, content);
  await syncBlogTags(id, tagsRaw.split(",").filter(Boolean));
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
