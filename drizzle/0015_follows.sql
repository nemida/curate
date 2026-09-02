CREATE TABLE "follows" (
  "id" serial PRIMARY KEY NOT NULL,
  "follower_id" integer NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "following_id" integer NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  CONSTRAINT "follows_follower_following_unique" UNIQUE("follower_id", "following_id")
);
