import { NextResponse } from "next/server";
import { db } from "@/db";
import { sql } from "drizzle-orm";

export const DELETE = async () => {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "This endpoint is not available in production" },
      { status: 403 }
    );
  }

  try {
    await db.execute(sql`
      TRUNCATE TABLE
        comments,
        blog_likes,
        blog_tags,
        reading_list,
        follows,
        blogs,
        tags,
        users
      RESTART IDENTITY CASCADE
    `);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Failed to reset database:", error);
    return NextResponse.json({ error: "Failed to reset database" }, { status: 500 });
  }
};
