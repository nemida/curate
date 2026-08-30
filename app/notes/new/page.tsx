"use client";
import { createNote } from "@/app/actions/notes";
import { useNotification } from "@/app/components/NotificationContext";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const NewNote = () => {
  const [state, formAction] = useActionState(createNote, {
    error: "",
    values: { title: "", author: "", url: "" },
    success: false,
  });

  const { showNotification } = useNotification();
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      showNotification("Note created.");
      router.push("/notes");
    }
  }, [state, showNotification, router]);

  return (
    <div className="max-w-lg">
      <h2 className="text-2xl font-bold mb-6">New note</h2>
      <Card>
        <CardHeader>
          <CardTitle>Note details</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Title</label>
              <Input type="text" name="title" required minLength={5} defaultValue={state.values?.title} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Author</label>
              <Input type="text" name="author" required minLength={5} defaultValue={state.values?.author} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">URL</label>
              <Input type="text" name="url" required minLength={5} defaultValue={state.values?.url} />
            </div>
            {state.error && <p className="text-destructive text-sm">{state.error}</p>}
            <Button type="submit" className="self-start">Create</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewNote;
