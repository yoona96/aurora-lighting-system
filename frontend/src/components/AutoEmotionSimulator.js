import React, { useState } from "react";
import EmotionController from "./EmotionController";
import LightingDisplay from "./LightingDisplay";

function AutoEmotionSimulator() {
  const [emotion, setEmotion] = useState("보통");

  return (
    <div style={{
      textAlign: "center",
      fontFamily: "'Segoe UI', sans-serif",
      padding: "20px"
    }}>
      <h1 style={{
        fontSize: "3rem",
        marginBottom: "40px"
      }}>
        오로라 라이팅 시스템
      </h1>
      <EmotionController onEmotionChange={setEmotion} />
      <div style={{ marginTop: "30px" }}>
        <LightingDisplay emotion={emotion} />
      </div>
    </div>
  );
}

export default AutoEmotionSimulator;
