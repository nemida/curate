"use client";

import { editBlog } from "@/app/actions/blogs";
import { useNotification } from "@/app/components/NotificationContext";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, use } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type EditBlogPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ title?: string; author?: string; url?: string }>;
};

const EditBlogPage = ({ params, searchParams }: EditBlogPageProps) => {
  const { id } = use(params);
  const { title, author, url } = use(searchParams);

  const [state, formAction] = useActionState(editBlog, {
    error: "",
    success: false,
  });

  const { showNotification } = useNotification();
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      showNotification("Blog updated.");
      router.push(`/blogs/${id}`);
    }
  }, [state, showNotification, router, id]);

  return (
    <div className="max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-6">Edit blog</h2>
      <Card>
        <CardHeader>
          <CardTitle>Blog details</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="flex flex-col gap-4">
            <input type="hidden" name="id" value={id} />
            <div className="flex flex-col gap-1.5">
              <label htmlFor="title" className="text-sm font-medium">Title</label>
              <Input
                key={`title-${state.values?.title ?? title}`}
                type="text"
                id="title"
                name="title"
                required
                minLength={5}
                defaultValue={state.values?.title ?? title}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="author" className="text-sm font-medium">Author</label>
              <Input
                key={`author-${state.values?.author ?? author}`}
                type="text"
                id="author"
                name="author"
                required
                minLength={5}
                defaultValue={state.values?.author ?? author}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="url" className="text-sm font-medium">URL</label>
              <Input
                key={`url-${state.values?.url ?? url}`}
                type="text"
                id="url"
                name="url"
                required
                minLength={5}
                defaultValue={state.values?.url ?? url}
              />
            </div>
            {state.error && (
              <p data-testid="edit-error" className="text-destructive text-sm">{state.error}</p>
            )}
            <div className="flex gap-2">
              <Button data-testid="save-blog-button" type="submit">
                Save changes
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/blogs/${id}`)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditBlogPage;
