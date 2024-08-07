import React from "react";
import styles from "./Dashboard.module.css";
import WeeklyWeightChart from "./WeeklyWeightChart"; // 새로운 컴포넌트 임포트
import useStore from "@/lib/store";
import { getYesterDate, getYesterdayDateInKorea } from "@/lib/utils";

// // 한국 시간대로 어제 날짜를 가져오는 함수
// export const getYesterdayDateInKorea = () => {
//   const now = new Date();
//   const utcOffset = now.getTimezoneOffset() * 60000; // 분 단위를 밀리초 단위로 변환
//   const koreaOffset = 9 * 60 * 60000; // 한국 시간대 오프셋 (UTC+9)
//   const koreaTime = new Date(now.getTime() + utcOffset + koreaOffset);

//   koreaTime.setDate(koreaTime.getDate() - 1); // 어제 날짜로 설정
//   return koreaTime;
// };

const Dashboard: React.FC = () => {
  const bears = useStore((state) => state.bears);

  // weightDifference의 평균값 계산
  const averageWeightDifference =
    bears.length > 0
      ? bears.reduce((acc, bear) => acc + bear.weightDifference, 0) /
        bears.length
      : 0;

  // 어제 날짜 계산
  const formattedDate = getYesterDate();
  // const formattedDate = koreanYesterday.toISOString().split("T")[0]; // YYYY-MM-DD 형식

  return (
    <div className={`${styles.container} font-sans`}>
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.headerDate}>
            <div className={styles.date}>Ranking</div>
          </div>
        </div>
      </header>
      <main>
        <section className={styles.content}>
          <p className="text-lg font-bold text-center mb-4">{formattedDate}</p>
          <div className={styles.gridContainer}>
            <div className={styles.card}>
              <WeeklyWeightChart />
            </div>
          </div>
        </section>
        <section className={styles.content}>
          <div className="bg-white p-5 rounded-lg shadow-md text-center">
            <h2 className="text-xl mb-2">챌린저 평균 몸무게 증감</h2>
            <hr className="border-t-2 border-black mb-2" />
            <p className="text-lg">
              {isNaN(averageWeightDifference)
                ? "0.00"
                : averageWeightDifference.toFixed(2)}
              kg
            </p>
          </div>
        </section>
      </main>
      <footer className={styles.footer}>
        <div>다이어트 챌린지</div>
      </footer>
    </div>
  );
};

export default Dashboard;
