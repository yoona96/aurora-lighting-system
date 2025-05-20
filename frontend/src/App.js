import React, { useState } from "react";
import LightingDisplay from "./components/LightingDisplay";
// import CSVEmotionPlayer from "./components/CSVEmotionPlayer";
import LiveEmotionPlayer from "./components/LiveEmotionPlayer";

const BACKEND_URL = "https://your-render-backend.onrender.com";

const response = await fetch(`${BACKEND_URL}/analyze-emotion`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    heartRate: 89,
    spo2: 97,
    calories: 4.5,
    activityLevel: 2
  })
});


function App() {
  const [emotion, setEmotion] = useState("보통");

  return (
    <div>
      <h1>오로라 라이팅 시스템</h1>
      <LiveEmotionPlayer onEmotionChange={setEmotion} interval={5000} />
      <LightingDisplay emotion={emotion} />
    </div>
  );
}

export default App;