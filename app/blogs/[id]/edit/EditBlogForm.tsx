"use client";

import { editBlog } from "@/app/actions/blogs";
import { useNotification } from "@/app/components/NotificationContext";
import MarkdownEditor from "@/app/components/MarkdownEditor";
import TagInput from "@/app/components/TagInput";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type EditBlogFormProps = {
  id: number;
  initialTitle: string;
  initialAuthor: string;
  initialUrl: string;
  initialContent: string;
  initialTags: string;
};

const EditBlogForm = ({
  id,
  initialTitle,
  initialAuthor,
  initialUrl,
  initialContent,
  initialTags,
}: EditBlogFormProps) => {
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
    <div className="max-w-2xl mx-auto">
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
                key={`title-${state.values?.title ?? initialTitle}`}
                type="text"
                id="title"
                name="title"
                required
                minLength={5}
                defaultValue={state.values?.title ?? initialTitle}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="author" className="text-sm font-medium">Author</label>
              <Input
                key={`author-${state.values?.author ?? initialAuthor}`}
                type="text"
                id="author"
                name="author"
                required
                minLength={5}
                defaultValue={state.values?.author ?? initialAuthor}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="url" className="text-sm font-medium">
                URL <span className="text-muted-foreground font-normal">(optional)</span>
              </label>
              <Input
                key={`url-${state.values?.url ?? initialUrl}`}
                type="text"
                id="url"
                name="url"
                defaultValue={state.values?.url ?? initialUrl}
                placeholder="https://..."
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">
                Content <span className="text-muted-foreground font-normal">(optional)</span>
              </label>
              <MarkdownEditor
                name="content"
                defaultValue={state.values?.content ?? initialContent}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">
                Tags <span className="text-muted-foreground font-normal">(optional)</span>
              </label>
              <TagInput
                name="tags"
                defaultValue={state.values?.tags ?? initialTags}
              />
            </div>
            {state.error && (
              <p data-testid="edit-error" className="text-destructive text-sm">
                {state.error}
              </p>
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

export default EditBlogForm;
