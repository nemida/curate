"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { getUserByUsername } from "../services/users";

export const registerUser = async (
  prevState: {
    error: string;
    values?: { username?: string; name?: string };
  },
  formData: FormData,
) => {
  const username = (formData.get("username") as string)?.trim();
  const name = (formData.get("name") as string)?.trim();
  const password = formData.get("password") as string;
  const confirmpass = formData.get("confirmpass") as string;

  const safeValues = { username, name };

  if (!username || username.length < 4)
    return {
      error: "Username is too short",
      values: safeValues,
    };
  if (!password || password.length < 4)
    return {
      error: "Password is too short",
      values: safeValues,
    };
  if (!confirmpass || confirmpass !== password)
    return {
      error: "Passwords do not match",
      values: safeValues,
    };

  const existingUser = await getUserByUsername(username);
  if (existingUser)
    return {
      error: "Username already exists",
      values: safeValues,
    };

  const passwordHash = await bcrypt.hash(password, 10);

  await db.insert(users).values({ username, name, passwordHash });

  redirect("/login");
};
