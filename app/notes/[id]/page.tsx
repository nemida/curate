import { notFound } from "next/navigation";
import { getNoteById } from "../../services/notes";
import { increaseLikes } from "@/app/actions/notes";
import { addToReadingListAction } from "@/app/actions/readingList";
import { getCurrentUser } from "@/app/services/session";
import { isInReadingList } from "@/app/services/readingList";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const NotePage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const note = await getNoteById(Number(id));

  if (!note) notFound();

  const url = note.url.startsWith("http") ? note.url : `https://${note.url}`;

  const currentUser = await getCurrentUser();
  const isOwner = currentUser?.id === note.userId;
  const alreadyInList = currentUser && !isOwner
    ? await isInReadingList(currentUser.id, note.id)
    : false;

  return (
    <div className="max-w-xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{note.title}</CardTitle>
          <CardDescription>by {note.author}</CardDescription>
        </CardHeader>
        {note.url && (
          <CardContent>
            <a href={url} className="text-sm text-primary hover:underline break-all" target="_blank" rel="noreferrer">
              {note.url}
            </a>
          </CardContent>
        )}
        <CardFooter className="gap-3 flex-wrap">
          <form action={increaseLikes}>
            <input type="hidden" name="id" value={note.id} />
            <Button type="submit" variant="outline" size="sm">
              ♥ {note.likes} likes
            </Button>
          </form>
          {note.url && (
            <a href={url} target="_blank" rel="noreferrer" className={cn(buttonVariants({ size: "sm" }))}>
              Visit source
            </a>
          )}
          {currentUser && !isOwner && (
            <form action={addToReadingListAction}>
              <input type="hidden" name="blogId" value={note.id} />
              <Button type="submit" variant="outline" size="sm" disabled={alreadyInList}>
                {alreadyInList ? "✓ In reading list" : "+ Add to reading list"}
              </Button>
            </form>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default NotePage;
