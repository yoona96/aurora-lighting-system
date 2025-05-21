import React, { useEffect, useState } from "react";

function LiveEmotionPlayer({ onEmotionChange, interval = 5000 }) {
  const [emotion, setEmotion] = useState("보통");

  useEffect(() => {
    const fetchEmotion = async () => {
      try {
        const BACKEND_URL = "https://aurora-lighting-system.onrender.com";

        // ✅ URL 쿼리에서 access_token 추출
        const queryParams = new URLSearchParams(window.location.search);
        const token = queryParams.get("access_token");

        if (!token) {
          console.error("❌ access_token이 URL에 없습니다.");
          return;
        }

        const response = await fetch(`${BACKEND_URL}/emotion-now`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ access_token: token })
        });

        const data = await response.json();
        setEmotion(data.emotion);
        onEmotionChange(data.emotion);
      } catch (err) {
        console.error("감정 요청 실패:", err);
      }
    };

    fetchEmotion(); // 최초 호출
    const intervalId = setInterval(fetchEmotion, interval);

    return () => clearInterval(intervalId);
  }, [interval, onEmotionChange]);

  return <div>현재 감정 상태: {emotion}</div>;
}

export default LiveEmotionPlayer;
