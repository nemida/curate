"use client";

import { useActionState, useEffect, useRef } from "react";
import { addCommentAction, deleteCommentAction } from "@/app/actions/comments";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Comment = {
  id: number;
  content: string;
  createdAt: Date;
  user: { id: number; name: string; username: string };
};

type CommentsSectionProps = {
  blogId: number;
  comments: Comment[];
  currentUserId?: number;
};

export default function CommentsSection({
  blogId,
  comments,
  currentUserId,
}: CommentsSectionProps) {
  const [state, formAction] = useActionState(addCommentAction, {
    error: "",
    success: false,
  });

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <div data-testid="comments-section" className="mt-6 flex flex-col gap-4">
      <h3 className="text-lg font-semibold">
        Comments ({comments.length})
      </h3>

      {comments.length === 0 && (
        <p data-testid="no-comments" className="text-sm text-muted-foreground">
          No comments yet. Be the first!
        </p>
      )}

      <ul className="flex flex-col gap-3">
        {comments.map((comment) => (
          <li key={comment.id} data-testid={`comment-${comment.id}`}>
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{comment.user.name}</span>
                    <span className="text-xs text-muted-foreground">@{comment.user.username}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {currentUserId === comment.user.id && (
                    <form action={deleteCommentAction}>
                      <input type="hidden" name="commentId" value={comment.id} />
                      <input type="hidden" name="blogId" value={blogId} />
                      <Button
                        data-testid={`delete-comment-${comment.id}`}
                        type="submit"
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-destructive h-auto py-0.5 px-2 text-xs"
                      >
                        Delete
                      </Button>
                    </form>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p data-testid={`comment-content-${comment.id}`} className="text-sm">
                  {comment.content}
                </p>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>

      {currentUserId ? (
        <form ref={formRef} action={formAction} className="flex flex-col gap-2">
          <input type="hidden" name="blogId" value={blogId} />
          <textarea
            name="content"
            data-testid="comment-input"
            placeholder="Write a comment..."
            rows={3}
            maxLength={1000}
            required
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
          />
          {state.error && (
            <p data-testid="comment-error" className="text-destructive text-sm">
              {state.error}
            </p>
          )}
          <Button
            data-testid="submit-comment-button"
            type="submit"
            size="sm"
            className="self-start"
          >
            Post comment
          </Button>
        </form>
      ) : (
        <p className="text-sm text-muted-foreground">
          <a href="/login" className="text-primary hover:underline">Log in</a> to leave a comment.
        </p>
      )}
    </div>
  );
}
