import React, { useEffect } from "react";

const emotions = ["이완", "스트레스", "집중", "피로", "긍정"];

function AutoEmotionSimulator({ onEmotionChange, enabled = false, interval = 5000 }) {
  useEffect(() => {
    if (!enabled) return;

    const timer = setInterval(() => {
      const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
      onEmotionChange(randomEmotion);
    }, interval);

    return () => clearInterval(timer);
  }, [enabled, interval, onEmotionChange]);

  return null; // 화면에 나타나는 컴포넌트는 아님
}

export default AutoEmotionSimulator;