"use client";
import Dashboard from "@/components/Dashboard";
import useStore from "../../lib/store";

type PageProps = {
  params: {
    id: number;
  };
};

export default function Page({ params }: PageProps) {
  const setId = useStore((state) => state.setId);
  setId(params.id);
  return <Dashboard />;
}
