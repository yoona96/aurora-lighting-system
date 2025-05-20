import React, { useState } from "react";
import LightingDisplay from "./components/LightingDisplay";
// import CSVEmotionPlayer from "./components/CSVEmotionPlayer";
import LiveEmotionPlayer from "./components/LiveEmotionPlayer";

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