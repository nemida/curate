import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export const getUsers = async () => {
  return db.query.users.findMany();
};

export const getUserByUsername = async (username: string) => {
  return db.query.users.findFirst({
    where: eq(users.username, username),
    with: {
      blogs: {
        with: { blogLikes: true },
      },
    },
  });
};

export const getUserInfoByToken = async (token: string) => {
  const user = await db.query.users.findFirst({
    where: eq(users.token, token),
    columns: { id: true, username: true, name: true },
    with: {
      blogs: {
        columns: {
          author: true,
          title: true,
          url: true,
        },
      },
    },
  });

  if (!user) return null;

  return {
    id: user.id,
    username: user.username,
    name: user.name,
    createdBlogs: user.blogs,
  };
};
