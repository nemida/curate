-- Make url nullable (blogs can now be standalone posts without an external URL)
ALTER TABLE "blogs" ALTER COLUMN "url" DROP NOT NULL;

-- Add content column for markdown blog post body
ALTER TABLE "blogs" ADD COLUMN "content" text;
