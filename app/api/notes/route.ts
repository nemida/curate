import { getNotes } from "@/app/services/notes"
import { NextResponse } from "next/server"

export const GET = async () => {
  const notes = await getNotes();
  return NextResponse.json(notes);
  
}