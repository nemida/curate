import Link from "next/link";
import { getNotes } from "../services/notes";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type NotesPageProps = {
  searchParams: Promise<{ filter?: string }>;
};

const Notes = async ({ searchParams }: NotesPageProps) => {
  const { filter } = await searchParams;
  const rawNotes = await getNotes(filter);
  const sortedNotes = [...rawNotes].sort((a, b) => b.likes - a.likes);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Notes</h2>

      <form action="/notes" method="GET" className="flex gap-2 mb-8">
        <Input
          type="text"
          name="filter"
          defaultValue={filter}
          placeholder="Search notes..."
          className="max-w-sm"
        />
        <Button type="submit" variant="outline">Search</Button>
      </form>

      {sortedNotes.length === 0 && (
        <p className="text-muted-foreground text-sm">No notes found.</p>
      )}

      <ul className="flex flex-col gap-3">
        {sortedNotes.map((note) => (
          <li key={note.id}>
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{note.title}</CardTitle>
                    <CardDescription>by {note.author}</CardDescription>
                  </div>
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

export default Notes;
