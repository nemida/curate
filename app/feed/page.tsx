import { redirect } from "next/navigation";
import { getCurrentUser } from "@/app/services/session";
import { getFeedBlogs } from "@/app/services/follows";
import BlogsListClient from "@/app/blogs/BlogsListClient";
import Link from "next/link";

const FeedPage = async () => {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/login");

  const feedBlogs = await getFeedBlogs(currentUser.id);

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-2">Your Feed</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Blogs from people you follow.
      </p>
      {feedBlogs.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p className="mb-2">Nothing here yet.</p>
          <p className="text-sm">
            <Link href="/users" className="text-primary hover:underline">
              Find people to follow
            </Link>
          </p>
        </div>
      ) : (
        <BlogsListClient blogs={feedBlogs} />
      )}
    </div>
  );
};

export default FeedPage;
