import { getBlogs } from "@/app/services/blogs"
import { NextResponse } from "next/server"

export const GET = async () => {
  const blogs = await getBlogs();
  return NextResponse.json(blogs);
}