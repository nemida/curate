"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function BlogFilter({ defaultValue }: { defaultValue?: string }) {
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
    <form onSubmit={handleSubmit} className="flex gap-2 mb-8">
      <Input
        key={defaultValue || 'empty'}
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
  );
}
