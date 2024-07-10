import React, { useState } from "react";
import styles from "./Dashboard.module.css";
import { AiFillCaretUp, AiFillCaretDown } from "react-icons/ai";

interface CardProps {
  title: string;
  calories: string;
  subtitle?: string;
  calorieDifference?: number; // Positive or negative number indicating difference
}

const Card: React.FC<CardProps> = ({
  title,
  calories,
  subtitle,
  calorieDifference,
}) => {
  calorieDifference = 150; // 이 예제에서는 항상 -150으로 설정했습니다
  const [showIndicator, setShowIndicator] = useState(false);

  const toggleIndicator = () => setShowIndicator((prev) => !prev);

  return (
    <div className={styles.card} onClick={toggleIndicator}>
      <div className={styles.title}>{title}</div>
      <div className={styles.calories}>{calories}</div>
      {showIndicator && (
        <div className={styles.calIndicator}>
          <div className={styles.calTitle}>전일대비</div>
          {calorieDifference !== undefined && calorieDifference > 0 ? (
            <AiFillCaretUp className={styles.greenArrow} />
          ) : (
            <AiFillCaretDown className={styles.redArrow} />
          )}
          <div className={styles.calDiff}>{Math.abs(calorieDifference)}</div>
        </div>
      )}
    </div>
  );
};

export default Card;
