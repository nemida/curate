"use client";

import { useState, KeyboardEvent } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

type TagInputProps = {
  name: string;
  defaultValue?: string; // comma-separated initial tags
};

export default function TagInput({ name, defaultValue = "" }: TagInputProps) {
  const [tags, setTags] = useState<string[]>(
    defaultValue ? defaultValue.split(",").map((t) => t.trim()).filter(Boolean) : []
  );
  const [inputValue, setInputValue] = useState("");

  const addTag = (value: string) => {
    const tag = value.trim().toLowerCase();
    if (tag && !tags.includes(tag)) {
      setTags((prev) => [...prev, tag]);
    }
    setInputValue("");
  };

  const removeTag = (tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === "Backspace" && inputValue === "" && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-1.5 min-h-8">
        {tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="gap-1 pr-1">
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              data-testid={`remove-tag-${tag}`}
              className="hover:text-destructive transition-colors"
              aria-label={`Remove tag ${tag}`}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
      <Input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => { if (inputValue) addTag(inputValue); }}
        placeholder="Add tags (press Enter or comma to add)..."
        data-testid="tag-input"
      />
      <input type="hidden" name={name} value={tags.join(",")} />
    </div>
  );
}
