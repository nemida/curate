import { db } from "@/db";
import { follows, blogs, blogLikes, blogTags } from "@/db/schema";
import { and, eq, inArray } from "drizzle-orm";

export const isFollowing = async (followerId: number, followingId: number) => {
  const row = await db.query.follows.findFirst({
    where: and(
      eq(follows.followerId, followerId),
      eq(follows.followingId, followingId),
    ),
  });
  return !!row;
};

export const followUser = async (followerId: number, followingId: number) => {
  await db.insert(follows).values({ followerId, followingId }).onConflictDoNothing();
};

export const unfollowUser = async (followerId: number, followingId: number) => {
  await db.delete(follows).where(
    and(eq(follows.followerId, followerId), eq(follows.followingId, followingId))
  );
};

export const toggleFollow = async (followerId: number, followingId: number) => {
  const already = await isFollowing(followerId, followingId);
  if (already) {
    await unfollowUser(followerId, followingId);
    return "unfollowed";
  } else {
    await followUser(followerId, followingId);
    return "followed";
  }
};

export const getFollowerCount = async (userId: number) => {
  const rows = await db.query.follows.findMany({
    where: eq(follows.followingId, userId),
  });
  return rows.length;
};

export const getFollowingCount = async (userId: number) => {
  const rows = await db.query.follows.findMany({
    where: eq(follows.followerId, userId),
  });
  return rows.length;
};

export const getFeedBlogs = async (userId: number) => {
  const following = await db.query.follows.findMany({
    where: eq(follows.followerId, userId),
  });

  if (following.length === 0) return [];

  const followingIds = following.map((f) => f.followingId);

  return db.query.blogs.findMany({
    where: (b, { inArray: qIn }) => qIn(b.userId, followingIds),
    with: {
      blogLikes: true,
      blogTags: { with: { tag: true } },
    },
    orderBy: (b, { desc }) => [desc(b.id)],
  });
};
