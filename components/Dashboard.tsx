"use client";

import React from "react";
import styles from "./Dashboard.module.css";
import Card from "./Card";
import WeeklyCaloriesStackedChart from "./WeeklyCaloriesStackedChart"; // 새로운 컴포넌트 임포트
import WeeklyWeightChart from "./WeeklyWeightChart"; // 새로운 컴포넌트 임포트

type DashboardProps = {
  breakfast: number;
  lunch: number;
  dinner: number;
  snack: number;
  weight: number;
};

// 현재 날짜를 가져와 형식화하는 함수
const getCurrentDate = () => {
  const today = new Date();
  today.setDate(today.getDate() - 1); // 현재 날짜에서 하루를 뺍니다.
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString(); // 월은 0부터 시작하므로 +1하고, 두 자리로 만듭니다.
  const day = today.getDate().toString(); // 날짜를 두 자리로 만듭니다.
  return `${year}. ${month}. ${day}`;
};

const Dashboard: React.FC<DashboardProps> = ({
  breakfast,
  lunch,
  dinner,
  snack,
  weight,
}) => {
  const currentDate = getCurrentDate();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.date}>{currentDate}</div>
        <div className={styles.logo}>DailyReport</div>
      </header>
      <main>
        <section className={styles.content}>
          <div className={styles.sectionTitle}>총 칼로리</div>
          <div className={styles.sectionCalories}>
            {breakfast + lunch + dinner + snack} kcal
          </div>
          <div className={styles.gridContainer}>
            <Card
              title="아침"
              calories={`${breakfast} kcal`}
              subtitle={"어제보다 450kcal"}
            />
            <Card title="점심" calories={`${lunch} kcal`} />
            <Card title="저녁" calories={`${dinner} kcal`} />
            <Card title="간식" calories={`${snack} kcal`} />
          </div>
        </section>
        <section className={styles.content}>
          <div className={styles.gridContainer}>
            <Card title="몸무게" calories={`${weight} kg`} />
            <Card title="운동" calories="0분" />
          </div>
        </section>
        <section className={styles.content}>
          <WeeklyCaloriesStackedChart />
        </section>
        <section className={styles.content}>
          <WeeklyWeightChart />
        </section>
      </main>
      <footer className={styles.footer}>
        <div>다이어트 챌린지 3일차</div>
      </footer>
    </div>
  );
};

export default Dashboard;
