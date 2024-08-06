import { supabase } from "./supabaseClient";
import { getYesterDate, getYesterdayDateInKorea } from "./utils";

interface WeightDifference {
  userId: number;
  weightDifference: number;
  animal: string;
}

export const fetchWeightDifferences = async (
  roomId: number
): Promise<WeightDifference[]> => {
  // 1. Get user IDs and animals in the specified room
  const { data: users, error: userError } = await supabase
    .from("users")
    .select("id, animal")
    .eq("current_room", roomId);

  if (userError) {
    console.error("Error fetching users:", userError);
    return [];
  }

  if (!users || users.length === 0) {
    return [];
  }

  // Extract user IDs and animals
  const userIds = users.map((user) => user.id);
  const userAnimals = users.reduce((acc, user) => {
    acc[user.id] = user.animal;
    return acc;
  }, {} as { [key: number]: string });

  // 2. Get weight differences for each user
  const weightDifferences: WeightDifference[] = [];

  var startDate: string = "2024-07-18";
  if (roomId == 6) {
    startDate = "2024-07-18";
  } else if (roomId == 7) {
    startDate = "2024-07-22";
  } else if (roomId == 8) {
    startDate = "2024-08-01";
  }

  const currentDate: string = getYesterDate();

  for (const userId of userIds) {
    const { data: reports, error: reportError } = await supabase
      .from("daily_reports")
      .select("date, weight")
      .in("date", [startDate, currentDate])
      .eq("user_id", userId);

    if (reportError) {
      console.error(`Error fetching reports for user ${userId}:`, reportError);
      continue;
    }

    if (reports && reports.length === 2) {
      const weightDifference = parseFloat(
        (reports[1].weight - reports[0].weight).toFixed(2)
      );
      weightDifferences.push({
        userId,
        weightDifference,
        animal: userAnimals[userId],
      });
    }
  }

  // 3. Sort the weight differences in ascending order
  weightDifferences.sort((a, b) => a.weightDifference - b.weightDifference);

  return weightDifferences;
};
