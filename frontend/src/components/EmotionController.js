import React, { useEffect, useState, useRef } from "react";

function EmotionController({ onEmotionChange, interval = 5000 }) {
  const [emotion, setEmotion] = useState("보통");
  const [token, setToken] = useState(null);
  const [manualOverride, setManualOverride] = useState(false);
  const overrideTimer = useRef(null); // 수동 모드 타이머 참조

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

        if (!manualOverride) {
          setEmotion(data.emotion);
          onEmotionChange(data.emotion);
        }
      } catch (err) {
        // 무시
      }
    };

    if (extractedToken) {
      fetchEmotion();
      const intervalId = setInterval(fetchEmotion, interval);
      return () => clearInterval(intervalId);
    }
  }, [interval, onEmotionChange, manualOverride]);

  const handleManualEmotion = (selectedEmotion) => {
    setManualOverride(true);
    clearTimeout(overrideTimer.current); // 기존 타이머 제거
    setEmotion(selectedEmotion);
    onEmotionChange(selectedEmotion);

    // 일정 시간 후 자동 수신 재개
    overrideTimer.current = setTimeout(() => {
      setManualOverride(false);
    }, 60000); // 60초 후 자동 모드 복귀
  };

  const emotions = ["이완", "스트레스", "집중", "피로", "긍정", "보통"];

  return (
    <div>
      <h3 style={{ marginBottom: "10px" }}>감정 선택 또는 실시간 감정 반영</h3>
      <div style={{
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        gap: "10px"
      }}>
        {emotions.map((emo) => (
          <button
            key={emo}
            onClick={() => handleManualEmotion(emo)}
            style={{
              padding: "10px 20px",
              fontSize: "1rem",
              borderRadius: "8px",
              border: "1px solid #ccc",
              backgroundColor: "#fff",
              cursor: "pointer",
              boxShadow: "1px 1px 5px rgba(0,0,0,0.1)"
            }}
          >
            {emo}
          </button>
        ))}
      </div>
    </div>
  );
}

export default EmotionController;
