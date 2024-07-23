"use client";
import Dashboard from "@/components/Dashboard";

type PageProps = {
  params: {
    id: string;
  };
};

export default function Page({ params }: PageProps) {
  return (
    <Dashboard
      params={params} // params를 전달합니다.
    />
  );
}
