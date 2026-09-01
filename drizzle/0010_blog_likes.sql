-- Remove the likes integer column from blogs
ALTER TABLE "blogs" DROP COLUMN "likes";

-- Create the blog_likes junction table
CREATE TABLE "blog_likes" (
  "id" serial PRIMARY KEY NOT NULL,
  "user_id" integer NOT NULL REFERENCES "users"("id"),
  "blog_id" integer NOT NULL REFERENCES "blogs"("id"),
  CONSTRAINT "blog_likes_user_blog_unique" UNIQUE("user_id", "blog_id")
);
