import React, { useEffect, useState } from "react";

function EmotionController({ onEmotionChange, interval = 5000 }) {
  const [emotion, setEmotion] = useState("보통");
  const [token, setToken] = useState(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    let extractedToken = queryParams.get("access_token");

    if (!extractedToken && window.location.hash) {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      extractedToken = hashParams.get("access_token");
    }

    setToken(extractedToken);

    const fetchEmotion = async () => {
      try {
        const response = await fetch("https://aurora-lighting-system.onrender.com/emotion-now", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ access_token: extractedToken })
        });

        if (!response.ok) return;

        const data = await response.json();
        setEmotion(data.emotion);
        onEmotionChange(data.emotion);
      } catch (err) {
        // 에러는 무시
      }
    };

    if (extractedToken) {
      fetchEmotion();
      const intervalId = setInterval(fetchEmotion, interval);
      return () => clearInterval(intervalId);
    }
  }, [interval, onEmotionChange]);

  const handleManualEmotion = (selectedEmotion) => {
    setEmotion(selectedEmotion);
    onEmotionChange(selectedEmotion);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "monospace" }}>
      <h3>현재 감정 상태: {emotion}</h3>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "10px" }}>
        <button onClick={() => handleManualEmotion("이완")}>😌 이완</button>
        <button onClick={() => handleManualEmotion("스트레스")}>😫 스트레스</button>
        <button onClick={() => handleManualEmotion("집중")}>🎯 집중</button>
        <button onClick={() => handleManualEmotion("피로")}>😴 피로</button>
        <button onClick={() => handleManualEmotion("긍정")}>😊 긍정</button>
      </div>
    </div>
  );
}

export default EmotionController;
