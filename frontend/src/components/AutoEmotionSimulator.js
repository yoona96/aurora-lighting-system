import React, { useState } from "react";
import EmotionController from "./EmotionController"; // 새 통합 컴포넌트
import LightingDisplay from "./LightingDisplay";

function AutoEmotionSimulator() {
  const [emotion, setEmotion] = useState("보통");

  return (
    <div>
      <EmotionController onEmotionChange={setEmotion} />
      <LightingDisplay emotion={emotion} />
    </div>
  );
}

export default AutoEmotionSimulator;
