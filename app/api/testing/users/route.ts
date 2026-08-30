import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import bcrypt from "bcryptjs";

export const POST = async (request: NextRequest) => {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "This endpoint is not available in production" },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { username, name, password } = body;

    if (!username || !name || !password) {
      return NextResponse.json(
        { error: "Missing required fields (username, name, password)" },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const [user] = await db.insert(users).values({
      username,
      name,
      passwordHash,
    }).returning({
      id: users.id,
      username: users.username,
      name: users.name,
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("Failed to create test user:", error);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
};
