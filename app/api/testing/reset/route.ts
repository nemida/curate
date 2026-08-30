import { NextResponse } from "next/server";
import { db } from "@/db";
import { users, blogs, readingList } from "@/db/schema";

export const DELETE = async () => {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "This endpoint is not available in production" },
      { status: 403 }
    );
  }

  try {
    await db.delete(readingList);
    await db.delete(blogs);
    await db.delete(users);
    
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Failed to reset database:", error);
    return NextResponse.json({ error: "Failed to reset database" }, { status: 500 });
  }
};
