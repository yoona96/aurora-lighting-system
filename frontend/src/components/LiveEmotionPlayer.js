import React, { useEffect, useState } from "react";

function LiveEmotionPlayer({ onEmotionChange, interval = 5000 }) {
  const [emotion, setEmotion] = useState("보통");

  useEffect(() => {
    const fetchEmotion = async () => {
      try {
        const BACKEND_URL = "https://aurora-lighting-system.onrender.com";

        const response = await fetch(`${BACKEND_URL}/analyze-emotion`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            heartRate: 90,      // ★ 임시값: 나중에 Fitbit OAuth 연동되면 교체
            spo2: 97,
            calories: 5.2,
            activityLevel: 2
          })
        });

        const data = await response.json();
        setEmotion(data.emotion);
        onEmotionChange(data.emotion);
      } catch (err) {
        console.error("감정 요청 실패:", err);
      }
    };

    fetchEmotion(); // 최초 1회 호출
    const intervalId = setInterval(fetchEmotion, interval); // 주기적 호출

    return () => clearInterval(intervalId);
  }, [interval, onEmotionChange]);

  return <div>현재 감정 상태: {emotion}</div>;
}

export default LiveEmotionPlayer;