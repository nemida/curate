import { redirect } from "next/navigation";
import { getCurrentUser } from "../services/session";
import { getReadingListForUser } from "../services/readingList";
import { generateAPIToken } from "../actions/users";
import TokenSectionClient from "./TokenSectionClient";
import { markAsReadAction } from "../actions/readingList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

const Profile = async () => {
  const user = await getCurrentUser();

  if (!user) redirect("/login");

  const readingList = await getReadingListForUser(user.id);
  const unread = readingList.filter((e) => !e.read);
  const read = readingList.filter((e) => e.read);

  return (
    <div className="flex flex-col gap-8 max-w-2xl">
      <Card data-testid="user-profile" className="w-full">
        <CardHeader>
          <CardTitle>My Profile</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <p data-testid="user-name" className="text-sm"><span className="font-medium">Name:</span> {user.name}</p>
            <p data-testid="user-username" className="text-sm"><span className="font-medium">Username:</span> {user.username}</p>
          </div>

          <TokenSectionClient initialToken={user.token} />
        </CardContent>
      </Card>

      <div data-testid="reading-list-section" className="flex flex-col gap-6">
        <h2 className="text-xl font-bold">My Reading List</h2>

        {readingList.length === 0 ? (
          <p data-testid="empty-reading-list" className="text-sm text-muted-foreground">
            Your reading list is empty. Add blogs from their detail pages.
          </p>
        ) : (
          <>
            <div data-testid="unread-section" className="flex flex-col gap-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Unread ({unread.length})
              </h3>
              {unread.length === 0 ? (
                <p data-testid="no-unread-blogs" className="text-sm text-muted-foreground">You&apos;re all caught up!</p>
              ) : (
                <ul className="flex flex-col gap-2">
                  {unread.map((entry) => (
                    <li key={entry.id}>
                      <Card>
                        <CardContent className="pt-4 flex items-center justify-between gap-4 flex-wrap">
                          <div className="flex flex-col gap-0.5">
                            <p className="font-medium">{entry.blog.title}</p>
                            <p className="text-sm text-muted-foreground">by {entry.blog.author}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Link href={`/blogs/${entry.blogId}`} className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
                              View →
                            </Link>
                            <form action={markAsReadAction}>
                              <input type="hidden" name="entryId" value={entry.id} />
                              <Button data-testid={`mark-read-${entry.id}`} type="submit" size="sm">Mark as read</Button>
                            </form>
                          </div>
                        </CardContent>
                      </Card>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Read ({read.length})
              </h3>
              {read.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nothing marked as read yet.</p>
              ) : (
                <ul className="flex flex-col gap-2">
                  {read.map((entry) => (
                    <li key={entry.id}>
                      <Card>
                        <CardContent className="pt-4 flex items-center justify-between gap-4 flex-wrap">
                          <div className="flex flex-col gap-0.5">
                            <p className="font-medium text-muted-foreground">{entry.blog.title}</p>
                            <p className="text-sm text-muted-foreground">by {entry.blog.author}</p>
                          </div>
                          <Link href={`/blogs/${entry.blogId}`} className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
                            View →
                          </Link>
                        </CardContent>
                      </Card>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
