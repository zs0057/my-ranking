"use client";

import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { getWeeklyReport, getCurrentRoom } from "@/lib/utils"; // 올바른 경로로 수정하세요.
import { usePathname } from "next/navigation";

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function extractNumbers(pathname: string): string {
  return pathname.replace(/\D/g, "");
}

const WeeklyWeightChart: React.FC = () => {
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
        label: "몸무게",
        data: Array(14).fill(0), // 초기 임시 데이터
        borderColor: "#ff6b81",
        backgroundColor: "rgba(255, 107, 129, 0.2)",
        fill: true,
      },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      const { current_room } = await getCurrentRoom(userId);
      const xs = await getWeeklyReport(userId);
      console.log(current_room);
      // weight 값을 추출하고 null을 0으로 변환
      const weight = xs.map((item: any) => item.weight ?? 0);
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
              label: "몸무게",
              data: weight,
              borderColor: "#ff6b81",
              backgroundColor: "rgba(255, 107, 129, 0.2)",
              fill: true,
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
              label: "몸무게",
              data: weight,
              borderColor: "#ff6b81",
              backgroundColor: "rgba(255, 107, 129, 0.2)",
              fill: true,
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
        display: true,
        position: "top",
      },
      title: {
        display: true,
        text: "주간 몸무게 변화",
        font: {
          size: 20,
          weight: "bold",
        },
        color: "#333",
      },
    },
  };

  return <Line data={data} options={options} height={200} />;
};

export default WeeklyWeightChart;
