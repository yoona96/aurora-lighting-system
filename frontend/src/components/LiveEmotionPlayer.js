import React, { useEffect, useState } from "react";

function LiveEmotionPlayer({ onEmotionChange, interval = 5000 }) {
  const [emotion, setEmotion] = useState("보통");
  const [rawData, setRawData] = useState({});
  const [lastUpdate, setLastUpdate] = useState("");
  const [token, setToken] = useState(null);          // 화면에 표시할 토큰
  const [log, setLog] = useState([]);                // 화면에 누적 출력할 로그

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    let extractedToken = queryParams.get("access_token");

    if (!extractedToken && window.location.hash) {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      extractedToken = hashParams.get("access_token");
    }

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
        setRawData(data);
        setLastUpdate(new Date().toLocaleTimeString());
        onEmotionChange(data.emotion);
      } catch (err) {
        // 에러는 조용히 무시
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
      <div>현재 감정 상태: {emotion}</div>
      <div style={{ fontSize: "14px", marginTop: "10px" }}>
        <p>❤️ 심박수: {rawData.heartRate}</p>
        <p>🌬️ 산소포화도: {rawData.spo2}</p>
        <p>🔥 칼로리: {rawData.calories}</p>
        <p>🏃 활동: {rawData.activityLevel}</p>
        <p>⏰ 마지막 갱신: {lastUpdate}</p>
      </div>
    </div>
  );
}

export default LiveEmotionPlayer;
