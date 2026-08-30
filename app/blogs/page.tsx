import Link from "next/link";
import { getBlogs } from "../services/blogs";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type BlogsPageProps = {
  searchParams: Promise<{ filter?: string }>;
};

const Blogs = async ({ searchParams }: BlogsPageProps) => {
  const { filter } = await searchParams;
  const rawBlogs = await getBlogs(filter);
  const sortedBlogs = [...rawBlogs].sort((a, b) => b.likes - a.likes);

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Blogs</h2>

      <form action="/blogs" method="GET" className="flex gap-2 mb-8">
        <Input
          type="text"
          name="filter"
          defaultValue={filter}
          placeholder="Search blogs..."
          className="max-w-sm"
        />
        <Button type="submit" variant="outline">Search</Button>
      </form>

      {sortedBlogs.length === 0 && (
        <p className="text-muted-foreground text-sm">No blogs found.</p>
      )}

      <ul className="flex flex-col gap-3">
        {sortedBlogs.map((blog) => (
          <li key={blog.id}>
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{blog.title}</CardTitle>
                    <CardDescription>by {blog.author}</CardDescription>
                  </div>
                  <Badge variant="secondary">♥ {blog.likes}</Badge>
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
        ))}
      </ul>
    </div>
  );
};

export default Blogs;
