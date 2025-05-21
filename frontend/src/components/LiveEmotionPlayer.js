import React, { useEffect, useState } from "react";

function LiveEmotionPlayer({ onEmotionChange, interval = 5000 }) {
  const [emotion, setEmotion] = useState("보통");

  useEffect(() => {
    // ✅ STEP 1: 쿼리에서 access_token 추출
    const queryParams = new URLSearchParams(window.location.search);
    let token = queryParams.get("access_token");

    // ✅ STEP 2: localStorage에 저장 (한 번만)
    if (token) {
      localStorage.setItem("access_token", token);
      // 👉 token이 URL에 노출되지 않도록 제거
      const cleanURL = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, cleanURL);
    } else {
      // ✅ STEP 3: localStorage에서 불러오기 (이미 저장된 경우)
      token = localStorage.getItem("access_token");
    }

    if (!token) {
      console.warn("❌ access_token 없음");
      return;
    }

    // ✅ STEP 4: 감정 정보 가져오기
    const fetchEmotion = async () => {
      try {
        const BACKEND_URL = "https://aurora-lighting-system.onrender.com";

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

    fetchEmotion();
    const intervalId = setInterval(fetchEmotion, interval);
    return () => clearInterval(intervalId);
  }, [interval, onEmotionChange]);

  return <div>현재 감정 상태: {emotion}</div>;
}

export default LiveEmotionPlayer;
