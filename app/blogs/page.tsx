import { getBlogs } from "../services/blogs";
import BlogFilter from "./BlogFilter";
import BlogsListClient from "./BlogsListClient";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blogs",
  description: "Browse and discover blog posts shared by the curate. community.",
};

type BlogsPageProps = {
  searchParams: Promise<{ filter?: string; tag?: string; page?: string }>;
};

const Blogs = async ({ searchParams }: BlogsPageProps) => {
  const { filter, tag, page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const { blogs, total, pageSize } = await getBlogs(filter, tag, page);
  const totalPages = Math.ceil(total / pageSize);

  const buildUrl = (p: number) => {
    const params = new URLSearchParams();
    if (filter) params.set("filter", filter);
    if (tag) params.set("tag", tag);
    params.set("page", String(p));
    return `/blogs?${params.toString()}`;
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Blogs</h2>

      <BlogFilter defaultValue={filter} activeTag={tag} />

      <BlogsListClient blogs={blogs} />

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-8">
          <div className="text-sm text-muted-foreground">
            Page {page} of {totalPages} · {total} blogs
          </div>
          <div className="flex gap-2">
            {page > 1 ? (
              <Link
                href={buildUrl(page - 1)}
                data-testid="prev-page"
                className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
              >
                ← Prev
              </Link>
            ) : (
              <span className={cn(buttonVariants({ variant: "outline", size: "sm" }), "opacity-40 pointer-events-none")}>
                ← Prev
              </span>
            )}
            {page < totalPages ? (
              <Link
                href={buildUrl(page + 1)}
                data-testid="next-page"
                className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
              >
                Next →
              </Link>
            ) : (
              <span className={cn(buttonVariants({ variant: "outline", size: "sm" }), "opacity-40 pointer-events-none")}>
                Next →
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Blogs;
