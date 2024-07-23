import React, { useEffect, useState } from "react";
import { Chart, registerables } from "chart.js";
import { Chart as ReactChart } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import useStore from "@/lib/store";
import { ClipLoader } from "react-spinners"; // react-spinners에서 로딩 스피너 추가

Chart.register(...registerables);
Chart.register(ChartDataLabels);

interface WeeklyWeightChartProps {
  width?: string | number;
  height?: string | number;
}

const WeeklyWeightChart: React.FC<WeeklyWeightChartProps> = () => {
  const fetchAndSetUsers = useStore((state) => state.fetchAndSetUsers);
  const bears = useStore((state) => state.bears);
  const id = useStore((state) => state.id);

  const [loading, setLoading] = useState(true); // 로딩 상태 추가

  useEffect(() => {
    const loadData = async () => {
      setLoading(true); // 로딩 시작
      await fetchAndSetUsers(id);
      setLoading(false); // 로딩 종료
    };
    loadData();
  }, [fetchAndSetUsers, id]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}
      >
        <ClipLoader size={50} color={"#123abc"} loading={loading} />{" "}
        {/* 로딩 스피너 */}
      </div>
    );
  }

  // weightDifference의 최저값 계산
  const minWeightDifference = Math.min(...bears.map((d) => d.weightDifference));
  // 최저값을 0.5 단위로 올림한 다음 -0.5를 추가
  const adjustedMin = Math.ceil(minWeightDifference / 0.5) * 0.5 - 1;
  const data = {
    labels: bears.map((d) => d.userId),
    datasets: [
      {
        label: "몸무게 변화",
        data: bears.map((d) => d.weightDifference),
        borderColor: "#ff6b81",
        backgroundColor: "rgba(255, 107, 129, 0.2)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    indexAxis: "y" as const,
    scales: {
      x: {
        beginAtZero: true,
        reverse: true, // x축을 반대로 설정하여 마이너스 값이 오른쪽으로 이동
        min: adjustedMin,
      },
    },
    plugins: {
      datalabels: {
        color: "black",
        anchor: "end" as const,
        align: "right" as const,
      },
    },
  };

  return (
    <div>
      <ReactChart type="bar" data={data} options={options} height={600} />
    </div>
  );
};

export default WeeklyWeightChart;
