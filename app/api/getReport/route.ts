// app/api/getReport/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("user_id");
  const date = searchParams.get("date");

  if (!userId || !date) {
    return NextResponse.json(
      { error: "Missing user_id or date" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("daily_reports")
    .select("breakfast, lunch, dinner, snack, weight")
    .eq("user_id", userId)
    .eq("date", date);

  if (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data || data.length === 0) {
    return NextResponse.json({ message: "No report found" }, { status: 404 });
  }

  return NextResponse.json(data[0]);
}
