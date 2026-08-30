import { redirect } from "next/navigation";
import { getCurrentUser } from "../services/session";
import { getReadingListForUser } from "../services/readingList";
import { generateAPIToken } from "../actions/users";
import { markAsReadAction } from "../actions/readingList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { cn } from "@/lib/utils";

const Profile = async () => {
  const user = await getCurrentUser();

  if (!user) redirect("/login");

  const readingList = await getReadingListForUser(user.id);

  return (
    <div className="flex flex-col gap-8 max-w-2xl">
      {/* Profile Card */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle>My Profile</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <p className="text-sm"><span className="font-medium">Name:</span> {user.name}</p>
            <p className="text-sm"><span className="font-medium">Username:</span> {user.username}</p>
          </div>

          <div className="border-t pt-4 flex flex-col gap-3">
            <p className="text-sm font-medium">API Token</p>
            {user.token ? (
              <p className="text-sm font-mono bg-muted px-3 py-2 rounded-md break-all">{user.token}</p>
            ) : (
              <p className="text-sm text-muted-foreground">No token generated yet.</p>
            )}
            <form action={generateAPIToken}>
              <Button type="submit" variant="outline" size="sm">
                {user.token ? "Regenerate token" : "Generate token"}
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>

      {/* Reading List */}
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-bold">My Reading List</h2>

        {readingList.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Your reading list is empty. Add blogs from their detail pages.
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {readingList.map((entry) => (
              <li key={entry.id}>
                <Card>
                  <CardContent className="pt-4 flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex flex-col gap-1">
                      <p className="font-medium">{entry.blog.title}</p>
                      <p className="text-sm text-muted-foreground">by {entry.blog.author}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant={entry.read ? "default" : "secondary"}>
                        {entry.read ? "Read" : "Unread"}
                      </Badge>
                      <Link
                        href={`/blogs/${entry.blogId}`}
                        className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                      >
                        View →
                      </Link>
                      {!entry.read && (
                        <form action={markAsReadAction}>
                          <input type="hidden" name="entryId" value={entry.id} />
                          <Button type="submit" size="sm" variant="ghost">
                            Mark as read
                          </Button>
                        </form>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Profile;
