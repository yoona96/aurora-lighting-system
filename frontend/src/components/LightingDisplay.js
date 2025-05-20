import React from "react";

const emotionColors = {
  이완: "#FFDAB9",     // peach puff
  스트레스: "#87CEFA", // light blue
  집중: "#F0E68C",     // khaki
  피로: "#D3D3D3",     // light gray
  긍정: "#90EE90",     // light green
  보통: "#F5F5F5"      // very light gray
};

function LightingDisplay({ emotion }) {
  const bgColor = emotionColors[emotion] || "#ffffff";

  return (
    <div
      style={{
        backgroundColor: bgColor,
        padding: "60px",
        textAlign: "center",
        transition: "background-color 1.2s ease-in-out", // 🎯 부드러운 전환 핵심
        minHeight: "200px",
      }}
    >
      <h1>{emotion ? `현재 감정: ${emotion}` : "감정을 선택하세요"}</h1>
    </div>
  );
}

export default LightingDisplay;
