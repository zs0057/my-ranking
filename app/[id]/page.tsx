"use client";
import Dashboard from "@/components/Dashboard";
import { useState, useEffect } from "react";
import { getContent, getYesterDate } from "@/lib/utils";

type PageProps = {
  params: {
    id: string;
  };
};

type Content = {
  breakfast: number;
  lunch: number;
  dinner: number;
  snack: number;
  weight: number;
} | null;

export default function Page({ params }: PageProps) {
  const [content, setContent] = useState<Content>(null);
  const userId = params.id; // 실제 user_id 값을 사용하세요
  const date = getYesterDate(); // 실제 날짜 값을 사용하세요

  useEffect(() => {
    async function fetchData() {
      const data = await getContent(userId, date);
      setContent(data);
    }
    fetchData();
  }, [userId, date]);

  const displayContent = {
    breakfast: content?.breakfast ?? 0,
    lunch: content?.lunch ?? 0,
    dinner: content?.dinner ?? 0,
    snack: content?.snack ?? 0,
    weight: content?.weight ?? 0,
  };

  return (
    <Dashboard
      breakfast={displayContent.breakfast}
      lunch={displayContent.lunch}
      dinner={displayContent.dinner}
      snack={displayContent.snack}
      weight={displayContent.weight}
    />
  );
}
