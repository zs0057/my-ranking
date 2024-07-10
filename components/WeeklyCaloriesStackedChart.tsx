"use client";

import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { getWeeklyReport, getCurrentRoom } from "@/lib/utils";
import { usePathname } from "next/navigation";

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function extractNumbers(pathname: string): string {
  // 숫자만 추출하여 문자열로 반환
  return pathname.replace(/\D/g, "");
}

const WeeklyCaloriesStackedChart: React.FC = () => {
  const pathname = usePathname();
  const userId = extractNumbers(pathname);
  const [data, setData] = useState<any>({
    labels: [
      "월",
      "화",
      "수",
      "목",
      "금",
      "토",
      "일",
      "월",
      "화",
      "수",
      "목",
      "금",
      "토",
      "일",
    ],
    datasets: [
      {
        label: "아침",
        data: [
          300, 400, 500, 600, 400, 300, 200, 300, 400, 500, 600, 400, 300, 200,
        ], // 임시 데이터
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        stack: "Stack 0",
      },
      {
        label: "점심",
        data: [
          400, 500, 600, 700, 500, 400, 300, 400, 500, 600, 700, 500, 400, 300,
        ], // 임시 데이터
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        stack: "Stack 0",
      },
      {
        label: "저녁",
        data: [
          500, 600, 700, 800, 600, 500, 400, 500, 600, 700, 800, 600, 500, 400,
        ], // 임시 데이터
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        stack: "Stack 0",
      },
      {
        label: "간식",
        data: [
          200, 300, 400, 500, 300, 200, 100, 200, 300, 400, 500, 300, 200, 100,
        ], // 임시 데이터
        backgroundColor: "rgba(153, 102, 255, 0.5)",
        stack: "Stack 0",
      },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      const xs = await getWeeklyReport(userId);
      const { current_room } = await getCurrentRoom(userId);
      // 데이터를 가공하여 각 항목별 배열로 변환하고 null을 0으로 변환
      const breakfast = xs.map((item: any) => item.breakfast ?? 0);
      const lunch = xs.map((item: any) => item.lunch ?? 0);
      const dinner = xs.map((item: any) => item.dinner ?? 0);
      const snack = xs.map((item: any) => item.snack ?? 0);
      if (current_room == 4) {
        setData({
          labels: [
            "월",
            "화",
            "수",
            "목",
            "금",
            "토",
            "일",
            "월",
            "화",
            "수",
            "목",
            "금",
            "토",
            "일",
          ],
          datasets: [
            {
              label: "아침",
              data: breakfast,
              backgroundColor: "rgba(255, 99, 132, 0.5)",
              stack: "Stack 0",
            },
            {
              label: "점심",
              data: lunch,
              backgroundColor: "rgba(54, 162, 235, 0.5)",
              stack: "Stack 0",
            },
            {
              label: "저녁",
              data: dinner,
              backgroundColor: "rgba(75, 192, 192, 0.5)",
              stack: "Stack 0",
            },
            {
              label: "간식",
              data: snack,
              backgroundColor: "rgba(153, 102, 255, 0.5)",
              stack: "Stack 0",
            },
          ],
        });
      } else if (current_room == 5) {
        setData({
          labels: [
            "목",
            "금",
            "토",
            "일",
            "월",
            "화",
            "수",
            "목",
            "금",
            "토",
            "일",
            "월",
            "화",
            "수",
          ],
          datasets: [
            {
              label: "아침",
              data: breakfast,
              backgroundColor: "rgba(255, 99, 132, 0.5)",
              stack: "Stack 0",
            },
            {
              label: "점심",
              data: lunch,
              backgroundColor: "rgba(54, 162, 235, 0.5)",
              stack: "Stack 0",
            },
            {
              label: "저녁",
              data: dinner,
              backgroundColor: "rgba(75, 192, 192, 0.5)",
              stack: "Stack 0",
            },
            {
              label: "간식",
              data: snack,
              backgroundColor: "rgba(153, 102, 255, 0.5)",
              stack: "Stack 0",
            },
          ],
        });
      }
    };

    fetchData();
  }, [userId]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "주간 칼로리 섭취량",
        font: {
          size: 20,
          weight: "bold",
        } as const,
        color: "#333",
      },
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };

  return <Bar data={data} options={options} height={400} />;
};

export default WeeklyCaloriesStackedChart;
