import React from "react";

// 감정별 색상 정의
const emotionColors = {
  이완: "#FFDAB9",     // peach puff
  스트레스: "#87CEFA", // light blue
  집중: "#F0E68C",     // khaki
  피로: "#D3D3D3",     // light gray
  긍정: "#90EE90",     // light green
  보통: "#F5F5F5"      // very light gray
};

function LightingDisplay({ emotion }) {
  const bgColor = emotionColors[emotion] || "#FFFFFF"; // 감정이 없을 경우 흰색

  const style = {
    backgroundColor: bgColor,
    width: "100%",
    height: "300px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.5rem",
    border: "2px solid #ccc",
    borderRadius: "10px",
    transition: "background-color 0.8s ease" // 부드러운 색상 전환
  };

  return (
    <div style={style}>
      현재 조명 색상: {bgColor} ({emotion})
    </div>
  );
}

export default LightingDisplay;
