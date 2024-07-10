// app/api/getReport/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("user_id");

  if (!userId) {
    return new NextResponse(JSON.stringify({ error: "Missing user_id" }), {
      status: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("current_room")
    .eq("id", userId)
    .single();

  if (userError) {
    console.error("Error fetching user data:", userError);
    return new NextResponse(JSON.stringify({ error: userError.message }), {
      status: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  if (!userData) {
    return new NextResponse(JSON.stringify({ message: "User not found" }), {
      status: 404,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  const currentRoom = userData.current_room;
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  yesterday.setHours(today.getHours() + 9);
  const startDate = new Date(currentRoom === 4 ? "2024-07-01" : "2024-07-04");
  const endDate = yesterday;

  const dateArray = [];
  for (
    let date = new Date(startDate);
    date <= endDate;
    date.setDate(date.getDate() + 1)
  ) {
    dateArray.push(new Date(date));
  }

  const results = [];
  for (const date of dateArray) {
    const dateString = date.toISOString().split("T")[0];
    const { data, error } = await supabase
      .from("daily_reports")
      .select("date, breakfast, lunch, dinner, snack, weight")
      .eq("user_id", userId)
      .eq("date", dateString)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching report data:", error);
      return new NextResponse(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    results.push({
      date: dateString,
      breakfast: data?.breakfast ?? 0,
      lunch: data?.lunch ?? 0,
      dinner: data?.dinner ?? 0,
      snack: data?.snack ?? 0,
      weight: data?.weight ?? 0,
    });
  }

  return new NextResponse(JSON.stringify(results), {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
