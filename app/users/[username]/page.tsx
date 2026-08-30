import Link from "next/link";
import { notFound } from "next/navigation";
import { getUserByUsername } from "../../services/users";
import { Card, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const UserPage = async ({ params }: { params: Promise<{ username: string }> }) => {
  const { username } = await params;
  const user = await getUserByUsername(username);

  if (!user) notFound();

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center text-xl font-bold">
          {user.name[0].toUpperCase()}
        </div>
        <div>
          <h2 className="text-2xl font-bold">{user.name}</h2>
          <p className="text-sm text-muted-foreground">@{user.username}</p>
        </div>
      </div>

      <h3 className="text-lg font-semibold mb-4">Notes</h3>

      {user.notes.length === 0 && (
        <p className="text-muted-foreground text-sm">No notes yet.</p>
      )}

      <ul className="flex flex-col gap-3">
        {user.notes.map((note) => (
          <li key={note.id}>
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle>{note.title}</CardTitle>
                  <Badge variant="secondary">♥ {note.likes}</Badge>
                </div>
              </CardHeader>
              <CardFooter className="gap-3">
                <Link href={`/notes/${note.id}`} className={cn(buttonVariants({ size: "sm" }))}>
                  View →
                </Link>
                {note.url && (
                  <a
                    href={note.url.startsWith("http") ? note.url : `https://${note.url}`}
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
