import React, { useEffect, useState } from "react";

function LiveEmotionPlayer({ onEmotionChange, interval = 5000 }) {
  const [emotion, setEmotion] = useState("보통");
  const [token, setToken] = useState(null); // 🔍 테스트 출력용

  useEffect(() => {
    // URL에서 access_token 추출
    const queryParams = new URLSearchParams(window.location.search);
    let extractedToken = queryParams.get("access_token");

    console.log("🧪 추출된 토큰:", extractedToken);

    if (!extractedToken && window.location.hash) {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      extractedToken = hashParams.get("access_token");
    }

    setToken(extractedToken); // 화면 출력용 상태 저장

    const fetchEmotion = async () => {
      try {
        const response = await fetch("https://aurora-lighting-system.onrender.com/emotion-now", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ access_token: extractedToken })
        });

        const data = await response.json();
        setEmotion(data.emotion);
        onEmotionChange(data.emotion);
      } catch (err) {
        console.error("감정 요청 실패:", err);
      }
    };

    if (extractedToken) {
      fetchEmotion(); // 최초 1회
      const intervalId = setInterval(fetchEmotion, interval);
      return () => clearInterval(intervalId);
    }
  }, [interval, onEmotionChange]);

  return (
    <div>
      <div>🔐 토큰 값: {token || "없음"}</div>
      <div>현재 감정 상태: {emotion}</div>
    </div>
  );
}

export default LiveEmotionPlayer;
