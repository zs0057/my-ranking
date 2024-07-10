// app/api/getReport/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("user_id");

  if (!userId) {
    return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
  }

  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("current_room")
    .eq("id", userId)
    .single();

  if (userError) {
    console.error("Error fetching user data:", userError);
    return NextResponse.json({ error: userError.message }, { status: 500 });
  }

  if (!userData) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  const currentRoom = userData.current_room;

  return NextResponse.json({ current_room: currentRoom });
}
