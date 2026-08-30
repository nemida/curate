import { notFound } from "next/navigation";
import { getBlogById } from "../../services/blogs";
import { increaseLikes } from "@/app/actions/blogs";
import { addToReadingListAction } from "@/app/actions/readingList";
import { getCurrentUser } from "@/app/services/session";
import { isInReadingList } from "@/app/services/readingList";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const BlogPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const blog = await getBlogById(Number(id));

  if (!blog) notFound();

  const url = blog.url.startsWith("http") ? blog.url : `https://${blog.url}`;

  const currentUser = await getCurrentUser();
  const isOwner = currentUser?.id === blog.userId;
  const alreadyInList = currentUser && !isOwner
    ? await isInReadingList(currentUser.id, blog.id)
    : false;

  return (
    <div data-testid="blog-detail" className="max-w-xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle data-testid="blog-title" className="text-2xl">{blog.title}</CardTitle>
          <CardDescription data-testid="blog-author">by {blog.author}</CardDescription>
        </CardHeader>
        {blog.url && (
          <CardContent>
            <a href={url} className="text-sm text-primary hover:underline break-all" target="_blank" rel="noreferrer">
              {blog.url}
            </a>
          </CardContent>
        )}
        <CardFooter className="gap-3 flex-wrap">
          <form action={increaseLikes}>
            <input type="hidden" name="id" value={blog.id} />
            <Button type="submit" variant="outline" size="sm">
              ♥ {blog.likes} likes
            </Button>
          </form>
          {blog.url && (
            <a href={url} target="_blank" rel="noreferrer" className={cn(buttonVariants({ size: "sm" }))}>
              Visit source
            </a>
          )}
          {currentUser && !isOwner && (
            <form action={addToReadingListAction}>
              <input type="hidden" name="blogId" value={blog.id} />
              <Button data-testid="add-to-reading-list-button" type="submit" variant="outline" size="sm" disabled={alreadyInList}>
                {alreadyInList ? "✓ In reading list" : "+ Add to reading list"}
              </Button>
            </form>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default BlogPage;
