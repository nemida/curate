"use client";

import { useOptimistic, useTransition } from "react";
import { toggleLikeAction } from "@/app/actions/blogs";
import { Button } from "@/components/ui/button";

type LikeButtonProps = {
  blogId: number;
  initialCount: number;
  initialLiked: boolean;
};

export default function LikeButton({ blogId, initialCount, initialLiked }: LikeButtonProps) {
  const [isPending, startTransition] = useTransition();

  const [optimistic, setOptimistic] = useOptimistic(
    { count: initialCount, liked: initialLiked },
    (state, _action: string) => ({
      count: state.liked ? state.count - 1 : state.count + 1,
      liked: !state.liked,
    }),
  );

  const handleClick = () => {
    startTransition(async () => {
      setOptimistic("toggle");
      const formData = new FormData();
      formData.set("id", String(blogId));
      await toggleLikeAction(formData);
    });
  };

  return (
    <Button
      data-testid="like-button"
      type="button"
      variant={optimistic.liked ? "default" : "outline"}
      size="sm"
      onClick={handleClick}
      disabled={isPending}
    >
      ♥ {optimistic.count} {optimistic.count === 1 ? "like" : "likes"}
    </Button>
  );
}
