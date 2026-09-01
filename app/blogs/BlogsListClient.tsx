"use client";

import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Blog = {
  id: number;
  title: string;
  author: string;
  url: string | null;
  blogLikes: { id: number }[];
};

export default function BlogsListClient({ blogs }: { blogs: Blog[] }) {
  if (blogs.length === 0) {
    return <p className="text-muted-foreground text-sm">No blogs found.</p>;
  }

  return (
    <ul data-testid="blogs-list" className="flex flex-col gap-3">
      {blogs.map((blog) => {
        const likeCount = blog.blogLikes.length;
        return (
          <li key={blog.id}>
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle><Link href={`/blogs/${blog.id}`}>{blog.title}</Link></CardTitle>
                    <CardDescription>by {blog.author}</CardDescription>
                  </div>
                  <Badge variant="secondary">{likeCount} {likeCount === 1 ? "like" : "likes"}</Badge>
                </div>
              </CardHeader>
              <CardFooter className="gap-3">
                <Link href={`/blogs/${blog.id}`} className={cn(buttonVariants({ size: "sm" }))}>
                  View →
                </Link>
                {blog.url && (
                  <a
                    href={blog.url.startsWith("http") ? blog.url : `https://${blog.url}`}
                    target="_blank"
                    rel="noreferrer"
                    className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                  >
                    Source
                  </a>
                )}
              </CardFooter>
            </Card>
          </li>
        );
      })}
    </ul>
  );
}
