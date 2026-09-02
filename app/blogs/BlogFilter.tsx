"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import Link from "next/link";

export default function BlogFilter({
  defaultValue,
  activeTag,
}: {
  defaultValue?: string;
  activeTag?: string;
}) {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const filter = formData.get("filter") as string;
    if (filter) {
      router.push(`/blogs?filter=${encodeURIComponent(filter)}`);
    } else {
      router.push(`/blogs`);
    }
  };

  return (
    <div className="flex flex-col gap-2 mb-8">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          key={defaultValue || "empty"}
          data-testid="filter-input"
          type="text"
          name="filter"
          defaultValue={defaultValue}
          placeholder="Search blogs..."
          className="max-w-sm"
        />
        <Button data-testid="search-button" type="submit" variant="outline">
          Search
        </Button>
      </form>
      {activeTag && (
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <span>Filtered by tag:</span>
          <span
            data-testid="active-tag-filter"
            className="inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-secondary"
          >
            {activeTag}
            <Link
              href="/blogs"
              aria-label="Clear tag filter"
              data-testid="clear-tag-filter"
            >
              <X className="h-3 w-3 hover:text-destructive transition-colors" />
            </Link>
          </span>
        </div>
      )}
    </div>
  );
}
