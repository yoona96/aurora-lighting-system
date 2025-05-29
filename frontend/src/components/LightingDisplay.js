import React from "react";

const emotionColors = {
  이완: "#FFDAB9",
  스트레스: "#87CEFA",
  집중: "#F0E68C",
  피로: "#D3D3D3",
  긍정: "#90EE90",
  보통: "#F5F5F5"
};

function LightingDisplay({ emotion }) {
  const bgColor = emotionColors[emotion] || "#FFFFFF";

  const style = {
    backgroundColor: bgColor,
    width: "100%",
    height: "250px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.5rem",
    borderRadius: "10px",
    transition: "background-color 0.8s ease",
    border: "1px solid #ddd"
  };

  return (
    <div style={style}>
      현재 감정: <strong style={{ marginLeft: "10px" }}>{emotion}</strong>
    </div>
  );
}

export default LightingDisplay;
