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
      } catch (err) {}
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
