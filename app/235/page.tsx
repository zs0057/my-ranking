"use client";
// src/pages/index.tsx
import { NextPage } from "next";
import useStore from "../../lib/store";
import Card from "@/components/Card";

const Home: NextPage = () => {
  const bears = useStore((state) => state.bears);
  const increase = useStore((state) => state.increase);
  const decrease = useStore((state) => state.decrease);

  return (
    <div>
      <h1>{bears} Bears</h1>
      <button onClick={increase}>Increase</button>
      <button onClick={decrease}>Decrease</button>
      <Card></Card>
    </div>
  );
};

export default Home;
