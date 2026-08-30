ALTER TABLE "notes" RENAME TO "blogs";
--> statement-breakpoint
ALTER TABLE "blogs" RENAME CONSTRAINT "notes_user_id_users_id_fk" TO "blogs_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "reading_list" RENAME CONSTRAINT "reading_list_blog_id_notes_id_fk" TO "reading_list_blog_id_blogs_id_fk";
