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

export async function getWeeklyReport1(userId: string, date: Date) {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const formatedDate = formatDate(date);
  try {
    const res = await fetch(
      `${baseUrl}/api/getWeeklyReport?user_id=${userId}&date=${formatedDate}`,
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

export async function getUserId(uuid: string) {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  try {
    const res = await fetch(`${baseUrl}/api/getUserId?uuid=${uuid}`, {
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

export const getYesterDate = () => {
  const now = new Date();
  const utcNow = now.getTime() + now.getTimezoneOffset() * 60000; // 현재 시간을 UTC로 변환
  const kstTime = utcNow + 9 * 60 * 60 * 1000; // UTC 시간을 KST로 변환
  const kstDate = new Date(kstTime);

  // KST 기준으로 어제 날짜 계산
  kstDate.setDate(kstDate.getDate() - 1);

  const year = kstDate.getFullYear();
  const month = (kstDate.getMonth() + 1).toString().padStart(2, "0");
  const day = kstDate.getDate().toString().padStart(2, "0");

  return `${year}-${month}-${day}`;
};

// 날짜를 형식화하는 함수
export const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// 한국 시간대로 어제 날짜를 가져오는 함수
export const getYesterdayDateInKorea = () => {
  const now = new Date();
  const utcOffset = now.getTimezoneOffset() * 60000; // 분 단위를 밀리초 단위로 변환
  const koreaOffset = 9 * 60 * 60000; // 한국 시간대 오프셋 (UTC+9)
  const koreaTime = new Date(now.getTime() + utcOffset + koreaOffset);

  koreaTime.setDate(koreaTime.getDate() - 1); // 어제 날짜로 설정
  return koreaTime;
};
