"use client";
import { createBlog } from "@/app/actions/blogs";
import { useNotification } from "@/app/components/NotificationContext";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const NewBlog = () => {
  const [state, formAction] = useActionState(createBlog, {
    error: "",
    values: { title: "", author: "", url: "" },
    success: false,
  });

  const { showNotification } = useNotification();
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      showNotification("Blog created.");
      router.push("/blogs");
    }
  }, [state, showNotification, router]);

  return (
    <div className="max-w-lg">
      <h2 className="text-2xl font-bold mb-6">New blog</h2>
      <Card>
        <CardHeader>
          <CardTitle>Blog details</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="title" className="text-sm font-medium">Title</label>
              <Input key={`title-${state.values?.title || ''}`} type="text" id="title" name="title" required minLength={5} defaultValue={state.values?.title} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="author" className="text-sm font-medium">Author</label>
              <Input key={`author-${state.values?.author || ''}`} type="text" id="author" name="author" required minLength={5} defaultValue={state.values?.author} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="url" className="text-sm font-medium">URL</label>
              <Input key={`url-${state.values?.url || ''}`} type="text" id="url" name="url" required minLength={5} defaultValue={state.values?.url} />
            </div>
            {state.error && <p className="text-destructive text-sm">{state.error}</p>}
            <Button data-testid="create-blog-button" type="submit" className="self-start">Create</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewBlog;
