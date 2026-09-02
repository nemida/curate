
CREATE TABLE "tags" (
  "id" serial PRIMARY KEY NOT NULL,
  "name" text NOT NULL,
  CONSTRAINT "tags_name_unique" UNIQUE("name")
);


CREATE TABLE "blog_tags" (
  "id" serial PRIMARY KEY NOT NULL,
  "blog_id" integer NOT NULL REFERENCES "blogs"("id") ON DELETE CASCADE,
  "tag_id" integer NOT NULL REFERENCES "tags"("id") ON DELETE CASCADE,
  CONSTRAINT "blog_tags_blog_tag_unique" UNIQUE("blog_id", "tag_id")
);
