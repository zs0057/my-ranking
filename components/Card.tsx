import React from "react";
import useStore from "../lib/store";

const Card: React.FC = () => {
  const bears = useStore((state) => state.bears);
  return <div className="ss">{bears}</div>;
};

export default Card;
