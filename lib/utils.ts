// lib/utils.ts
export async function getCurrentRoom(userId: string) {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  try {
    const res = await fetch(`${baseUrl}/api/getCurrentRoom?user_id=${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      throw new Error("error");
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.log("Error: ", error);
    return null;
  }
}

export async function getWeeklyReport(userId: string) {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  try {
    const res = await fetch(
      `${baseUrl}/api/getWeeklyReport?user_id=${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!res.ok) {
      throw new Error("error");
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.log("Error: ", error);
    return null;
  }
}

export async function getContent(userId: string, date: string) {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  try {
    const res = await fetch(
      `${baseUrl}/api/getReport?user_id=${userId}&date=${date}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!res.ok) {
      throw new Error("error");
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.log("Error: ", error);
    return null;
  }
}

// 어제 날짜를 가져와 형식화하는 함수
export const getYesterDate = () => {
  const today = new Date();
  today.setHours(today.getHours() + 9);
  today.setDate(today.getDate() - 1); // 현재 날짜에서 하루를 뺍니다.
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, "0"); // 월은 0부터 시작하므로 +1하고, 두 자리로 만듭니다.
  const day = today.getDate().toString().padStart(2, "0"); // 날짜를 두 자리로 만듭니다.

  return `${year}-${month}-${day}`;
};
