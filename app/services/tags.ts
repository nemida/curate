import { db } from "@/db";
import { tags, blogTags } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";

export const getAllTags = async () => {
  return db.query.tags.findMany({ orderBy: (t, { asc }) => [asc(t.name)] });
};

export const syncBlogTags = async (blogId: number, tagNames: string[]) => {
  const normalized = tagNames
    .map((t) => t.trim().toLowerCase())
    .filter((t) => t.length > 0);

  await db.delete(blogTags).where(eq(blogTags.blogId, blogId));

  if (normalized.length === 0) return;

  const upserted = await db
    .insert(tags)
    .values(normalized.map((name) => ({ name })))
    .onConflictDoUpdate({ target: tags.name, set: { name: tags.name } })
    .returning({ id: tags.id });

  await db.insert(blogTags).values(
    upserted.map((tag) => ({ blogId, tagId: tag.id }))
  );
};

export const getTagByName = async (name: string) => {
  return db.query.tags.findFirst({ where: eq(tags.name, name.toLowerCase()) });
};
