import React from "react";

const emotions = ["이완", "스트레스", "집중", "피로", "긍정"];

function EmotionSelector({ onEmotionChange }) {
  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>감정 선택</h2>
      {emotions.map((em) => (
        <button
          key={em}
          onClick={() => onEmotionChange(em)}
          style={{ margin: "10px", padding: "10px 20px", fontSize: "16px" }}
        >
          {em}
        </button>
      ))}
    </div>
  );
}

export default EmotionSelector;