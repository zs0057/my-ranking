import React, { useEffect, useState, useCallback, useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import styles from "./Dashboard.module.css";
import Card from "./Card";
import Card1 from "./Card1";
import Card2 from "./Card2";
import WeeklyCaloriesStackedChart from "./WeeklyCaloriesStackedChart"; // 새로운 컴포넌트 임포트
import WeeklyWeightChart from "./WeeklyWeightChart"; // 새로운 컴포넌트 임포트
import {
  getContent,
  getYesterdayDateInKorea,
  formatDate,
  getWeeklyReport1,
  getUserId,
} from "@/lib/utils";
import WeeklyExerciseMinutes from "./WeeklyExerciseMinutes";

type DashboardProps = {
  params: { id: string }; // params를 추가합니다.
};

type Content = {
  breakfast: number;
  lunch: number;
  dinner: number;
  snack: number;
  weight: number;
  exercise_minutes: number;
} | null;

const Dashboard: React.FC<DashboardProps> = ({
  params, // params를 props로 받습니다.
}) => {
  const [content, setContent] = useState<Content>(null);
  const [yesterdayContent, setYesterdayContent] = useState<Content>(null);
  const [date, setDate] = useState(getYesterdayDateInKorea());
  const [view, setView] = useState("daily"); // "daily" 또는 "weekly" 상태 추가
  const [breakfast, setBreakfast] = useState<number[]>([]);
  const [lunch, setLunch] = useState<number[]>([]);
  const [dinner, setDinner] = useState<number[]>([]);
  const [snack, setSnack] = useState<number[]>([]);
  const [labelDate, setLabelDate] = useState<string[]>([]);
  const [weight, setWeight] = useState<number[]>([]);
  const [exercise_minutes, setExercise_minutes] = useState<number[]>([]);
  const userIdRef = useRef<string | null>(null); // userId 상태 추가

  const fetchUserId = useCallback(async () => {
    const fetchedUserId = await getUserId(params.id);
    userIdRef.current = fetchedUserId.id;
  }, [params.id]);

  const fetchData = useCallback(
    async (fetchDate: Date) => {
      if (!userIdRef.current) {
        await fetchUserId();
      }
      if (!userIdRef.current) return; // userId가 없으면 데이터를 가져오지 않음
      const formattedDate = formatDate(fetchDate);
      const data = await getContent(userIdRef.current, formattedDate);
      setContent(data);
      const yesterdayDate = new Date(fetchDate);
      yesterdayDate.setDate(yesterdayDate.getDate() - 1); // 하루 전 날짜로 설정
      const yesterFormattedDate = formatDate(yesterdayDate);
      const yesterdatData = await getContent(
        userIdRef.current,
        yesterFormattedDate
      );
      setYesterdayContent(yesterdatData);
    },
    [fetchUserId]
  );

  const fetchWeeklyData = useCallback(
    async (fetchDate: Date) => {
      if (!userIdRef.current) {
        await fetchUserId();
      }
      if (!userIdRef.current) return; // userId가 없으면 데이터를 가져오지 않음
      const xs = await getWeeklyReport1(userIdRef.current, fetchDate);
      setBreakfast(xs.map((item: any) => item.breakfast ?? 0));
      setLunch(xs.map((item: any) => item.lunch ?? 0));
      setDinner(xs.map((item: any) => item.dinner ?? 0));
      setSnack(xs.map((item: any) => item.snack ?? 0));
      setExercise_minutes(xs.map((item: any) => item.exercise_minutes ?? 0));
      setLabelDate(
        xs.map((item: any) => {
          const date = new Date(item.date);
          return `${date.getMonth() + 1}.${date.getDate()}`;
        })
      );
      setWeight(xs.map((item: any) => item.weight ?? 0));
    },
    [fetchUserId]
  );

  useEffect(() => {
    const initialize = async () => {
      await fetchUserId();
    };
    initialize();
  }, [fetchUserId]);

  useEffect(() => {
    const fetchDataAsync = async () => {
      if (view === "daily") {
        await fetchData(date);
      } else if (view === "weekly") {
        await fetchWeeklyData(date);
      }
    };
    fetchDataAsync();
  }, [date, view, fetchData, fetchWeeklyData]);

  const handlePrevDay = () => {
    setDate((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() - 1);
      return newDate;
    });
  };

  const handleNextDay = () => {
    setDate((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() + 1);
      return newDate;
    });
  };

  const totalCalories =
    (content ? content.breakfast : 0) +
    (content ? content.lunch : 0) +
    (content ? content.dinner : 0) +
    (content ? content.snack : 0);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.headerDate}>
            <button className={styles.navButton} onClick={handlePrevDay}>
              <FaChevronLeft />
            </button>
            <div className={styles.date}>{formatDate(date)}</div>
            <button className={styles.navButton} onClick={handleNextDay}>
              <FaChevronRight />
            </button>
          </div>
        </div>
        <div className={styles.headerToggle}>
          <button
            className={`${styles.toggleButton} ${
              view === "daily" && styles.active
            }`}
            onClick={() => setView("daily")}
          >
            Daily
          </button>
          <button
            className={`${styles.toggleButton} ${
              view === "weekly" && styles.active
            }`}
            onClick={() => setView("weekly")}
          >
            Weekly
          </button>
        </div>
      </header>
      <main>
        <SwitchTransition mode="out-in">
          <CSSTransition
            key={view}
            timeout={300}
            classNames={{
              enter: styles.sectionEnter,
              enterActive: styles.sectionEnterActive,
              exit: styles.sectionExit,
              exitActive: styles.sectionExitActive,
            }}
          >
            {view === "daily" ? (
              <div>
                <section className={styles.content}>
                  <div className={styles.sectionTitle}>총 칼로리</div>
                  <div className={styles.sectionCalories}>
                    {totalCalories} kcal
                  </div>
                  <div className={styles.gridContainer}>
                    <Card
                      title="아침"
                      calories={`${
                        content?.breakfast ? content.breakfast : 0
                      } kcal`}
                      calorieDifference={
                        content && yesterdayContent
                          ? content.breakfast - yesterdayContent.breakfast
                          : 0
                      }
                    />
                    <Card
                      title="점심"
                      calories={`${content?.lunch ? content.lunch : 0} kcal`}
                      calorieDifference={
                        content && yesterdayContent
                          ? content.lunch - yesterdayContent.lunch
                          : 0
                      }
                    />
                    <Card
                      title="저녁"
                      calories={`${content?.dinner ? content.dinner : 0} kcal`}
                      calorieDifference={
                        content && yesterdayContent
                          ? content.dinner - yesterdayContent.dinner
                          : 0
                      }
                    />
                    <Card
                      title="간식"
                      calories={`${content?.snack ? content.snack : 0} kcal`}
                      calorieDifference={
                        content && yesterdayContent
                          ? content.snack - yesterdayContent.snack
                          : 0
                      }
                    />
                  </div>
                </section>
                <section className={styles.content}>
                  <div className={styles.gridContainer}>
                    <Card1
                      title="몸무게"
                      calories={`${content?.weight ? content.weight : 0} kg`}
                      calorieDifference={
                        content && yesterdayContent
                          ? parseFloat(
                              (
                                content.weight - yesterdayContent.weight
                              ).toFixed(1)
                            )
                          : 0.0
                      }
                    />
                    <Card2
                      title="운동"
                      calories={`${
                        content?.exercise_minutes ? content.exercise_minutes : 0
                      } 분`}
                      calorieDifference={
                        content && yesterdayContent
                          ? parseFloat(
                              (
                                content.exercise_minutes -
                                yesterdayContent.exercise_minutes
                              ).toFixed(1)
                            )
                          : 0.0
                      }
                    />
                  </div>
                </section>
              </div>
            ) : (
              <section className={styles.content}>
                <WeeklyCaloriesStackedChart
                  breakfast={breakfast}
                  lunch={lunch}
                  dinner={dinner}
                  snack={snack}
                  labelDate={labelDate}
                />
                <WeeklyWeightChart weight={weight} labelDate={labelDate} />
                <WeeklyExerciseMinutes
                  weight={exercise_minutes}
                  labelDate={labelDate}
                />
              </section>
            )}
          </CSSTransition>
        </SwitchTransition>
      </main>
      <footer className={styles.footer}>
        <div>다이어트 챌린지</div>
      </footer>
    </div>
  );
};

export default Dashboard;
