import React, { useEffect, useState } from "react";

function LiveEmotionPlayer({ onEmotionChange, interval = 5000 }) {
  const [emotion, setEmotion] = useState("보통");
  const [token, setToken] = useState(null);          // 화면에 표시할 토큰
  const [log, setLog] = useState([]);                // 화면에 누적 출력할 로그

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    // let extractedToken = queryParams.get("access_token");
    let extractedToken = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyM1FIWlMiLCJzdWIiOiJDSzlHM0giLCJpc3MiOiJGaXRiaXQiLCJ0eXAiOiJhY2Nlc3NfdG9rZW4iLCJzY29wZXMiOiJyb3h5IHJociByYWN0IiwiZXhwIjoxNzQ4MzczMDM1LCJpYXQiOjE3NDgzNDQyMzV9.T7ihLAKdhpKWJv4zE3nxAslmAfBWUb-ScLIXaTgo0-M"

    if (!extractedToken && window.location.hash) {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      extractedToken = hashParams.get("access_token");
    }

    
    setToken(extractedToken);
    setLog(prev => [...prev, `🔍 URL에서 추출된 토큰: ${extractedToken || "없음"}`]);

    const fetchEmotion = async () => {
      try {
        setLog(prev => [...prev, "📡 감정 요청 시작..."]);

        const response = await fetch("https://aurora-lighting-system.onrender.com/emotion-now", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ access_token: extractedToken })
        });

        if (!response.ok) {
          const errorText = await response.text();
          setLog(prev => [...prev, `❌ 응답 실패: ${response.status} ${response.statusText}`, errorText]);
          return;
        }

        const data = await response.json();
        setEmotion(data.emotion);
        onEmotionChange(data.emotion);
        setLog(prev => [...prev, `✅ 감정 수신: ${data.emotion}`]);
      } catch (err) {
        setLog(prev => [...prev, `❌ 네트워크 오류: ${err.message}`]);
      }
    };

    if (extractedToken) {
      fetchEmotion(); // 최초 1회
      const intervalId = setInterval(fetchEmotion, interval);
      return () => clearInterval(intervalId);
    } else {
      setLog(prev => [...prev, "⚠️ access_token이 없어서 요청하지 않음"]);
    }
  }, [interval, onEmotionChange]);

  return (
    <div style={{ padding: "20px", fontFamily: "monospace" }}>
      <h3>현재 감정 상태: {emotion}</h3>
      <h4>🔐 access_token:</h4>
      <div style={{ wordWrap: "break-word", background: "#f5f5f5", padding: "10px" }}>
        {token || "없음"}
      </div>

      <h4>📋 로그 출력</h4>
      <ul style={{ textAlign: "left" }}>
        {log.map((line, index) => (
          <li key={index}>{line}</li>
        ))}
      </ul>
    </div>
  );
}

export default LiveEmotionPlayer;
