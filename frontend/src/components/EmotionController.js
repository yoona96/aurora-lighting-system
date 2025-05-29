import React, { useEffect, useState } from "react";

function EmotionController({ interval = 5000 }) {
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
      } catch (err) {
        // 에러 처리
      }
    };

    if (extractedToken) {
      fetchEmotion(); // 최초 1회
      const intervalId = setInterval(fetchEmotion, interval);
      return () => clearInterval(intervalId);
    }
  }, [interval]);

  const handleEmotionChange = (e) => {
    const selectedEmotion = e.target.value;
    setEmotion(selectedEmotion);
    // 여기에 조명 제어 로직 추가
  };

  return (
    <div style={{ padding: "20px", fontFamily: "monospace" }}>
      <h3>현재 감정 상태: {emotion}</h3>
      <label>
        감정 선택:
        <select value={emotion} onChange={handleEmotionChange}>
          <option value="기쁨">기쁨</option>
          <option value="슬픔">슬픔</option>
          <option value="분노">분노</option>
          <option value="보통">보통</option>
        </select>
      </label>
    </div>
  );
}

export default EmotionController;