import Link from "next/link";
import { notFound } from "next/navigation";
import { getUserByUsername } from "../../services/users";
import { getCurrentUser } from "@/app/services/session";
import { isFollowing, getFollowerCount, getFollowingCount } from "@/app/services/follows";
import { toggleFollowAction } from "@/app/actions/follows";
import { Card, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const UserPage = async ({ params }: { params: Promise<{ username: string }> }) => {
  const { username } = await params;
  const user = await getUserByUsername(username);

  if (!user) notFound();

  const currentUser = await getCurrentUser();
  const isOwnProfile = currentUser?.id === user.id;
  const following = currentUser && !isOwnProfile
    ? await isFollowing(currentUser.id, user.id)
    : false;

  const [followerCount, followingCount] = await Promise.all([
    getFollowerCount(user.id),
    getFollowingCount(user.id),
  ]);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center text-xl font-bold">
            {user.name[0].toUpperCase()}
          </div>
          <div>
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <p className="text-sm text-muted-foreground">@{user.username}</p>
            <div className="flex gap-4 mt-1 text-sm text-muted-foreground">
              <span data-testid="follower-count"><strong>{followerCount}</strong> followers</span>
              <span data-testid="following-count"><strong>{followingCount}</strong> following</span>
            </div>
          </div>
        </div>
        {currentUser && !isOwnProfile && (
          <form action={toggleFollowAction}>
            <input type="hidden" name="followingId" value={user.id} />
            <input type="hidden" name="username" value={user.username} />
            <Button
              data-testid="follow-button"
              type="submit"
              variant={following ? "outline" : "default"}
              size="sm"
            >
              {following ? "Unfollow" : "Follow"}
            </Button>
          </form>
        )}
      </div>

      <h3 className="text-lg font-semibold mb-4">Blogs</h3>

      {user.blogs.length === 0 && (
        <p className="text-muted-foreground text-sm">No blogs yet.</p>
      )}

      <ul className="flex flex-col gap-3">
        {user.blogs.map((blog) => (
          <li key={blog.id}>
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle>{blog.title}</CardTitle>
                  <Badge variant="secondary">♥ {blog.blogLikes?.length ?? 0}</Badge>
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

export default UserPage;
