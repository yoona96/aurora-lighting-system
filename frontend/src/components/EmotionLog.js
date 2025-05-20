import React from "react";

function EmotionLog({ log }) {
  return (
    <div style={{ padding: "20px", fontSize: "14px" }}>
      <h3>감정 변화 로그</h3>
      <ul>
        {log.map((entry, index) => (
          <li key={index}>
            {entry.timestamp} - {entry.emotion}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default EmotionLog;