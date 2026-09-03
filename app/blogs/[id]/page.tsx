import { notFound } from "next/navigation";
import { getBlogById } from "../../services/blogs";
import { deleteBlogAction } from "@/app/actions/blogs";
import { addToReadingListAction } from "@/app/actions/readingList";
import { getCurrentUser } from "@/app/services/session";
import { isInReadingList } from "@/app/services/readingList";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import CommentsSection from "./CommentsSection";
import LikeButton from "./LikeButton";

const BlogPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const blog = await getBlogById(Number(id));

  if (!blog) notFound();

  const url = blog.url
    ? blog.url.startsWith("http") ? blog.url : `https://${blog.url}`
    : null;

  const currentUser = await getCurrentUser();
  const isOwner = currentUser?.id === blog.userId;
  const alreadyInList = currentUser && !isOwner
    ? await isInReadingList(currentUser.id, blog.id)
    : false;

  const likeCount = blog.blogLikes.length;
  const userHasLiked = currentUser
    ? blog.blogLikes.some((l) => l.userId === currentUser.id)
    : false;

  return (
    <div data-testid="blog-detail" className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle data-testid="blog-title" className="text-2xl">{blog.title}</CardTitle>
          <CardDescription data-testid="blog-author">by {blog.author}</CardDescription>
        </CardHeader>

        {blog.content && (
          <CardContent>
            <div
              data-testid="blog-content"
              className="prose prose-sm max-w-none dark:prose-invert"
            >
              <ReactMarkdown rehypePlugins={[rehypeSanitize]}>
                {blog.content}
              </ReactMarkdown>
            </div>
          </CardContent>
        )}

        {blog.blogTags.length > 0 && (
          <CardContent className="pt-0">
            <div data-testid="blog-tags" className="flex flex-wrap gap-1.5">
              {blog.blogTags.map(({ tag }) => (
                <Link
                  key={tag.id}
                  href={`/blogs?tag=${encodeURIComponent(tag.name)}`}
                  className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors hover:bg-secondary"
                  data-testid={`tag-${tag.name}`}
                >
                  {tag.name}
                </Link>
              ))}
            </div>
          </CardContent>
        )}

        {url && (
          <CardContent className="pt-0">
            <a href={url} className="text-sm text-primary hover:underline break-all" target="_blank" rel="noreferrer">
              {blog.url}
            </a>
          </CardContent>
        )}

        <CardFooter className="gap-3 flex-wrap">
          <LikeButton
            blogId={blog.id}
            initialCount={likeCount}
            initialLiked={userHasLiked}
          />
          {url && (
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
          {isOwner && (
            <>
              <Link
                data-testid="edit-blog-button"
                href={`/blogs/${blog.id}/edit`}
                className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
              >
                Edit
              </Link>
              <form action={deleteBlogAction}>
                <input type="hidden" name="id" value={blog.id} />
                <Button
                  data-testid="delete-blog-button"
                  type="submit"
                  variant="destructive"
                  size="sm"
                >
                  Delete
                </Button>
              </form>
            </>
          )}
        </CardFooter>
      </Card>
      <CommentsSection
        blogId={blog.id}
        comments={blog.comments}
        currentUserId={currentUser?.id}
      />
    </div>
  );
};

export default BlogPage;
