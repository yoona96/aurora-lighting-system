import React from "react";

// function EmotionLog({ log }) {
//   return (
//     <div style={{ padding: "20px", fontSize: "14px" }}>
//       <h3>감정 변화 로그</h3>
//       <ul>
//         {log.map((entry, index) => (
//           <li key={index}>
//             {entry.timestamp} - {entry.emotion}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

function EmotionLog({ emotionResult }) {
  if (!emotionResult) return null;

  return (
    <div style={{ padding: "1rem", backgroundColor: "#f8f9fa", borderRadius: "8px", marginTop: "1rem" }}>
      <h3>감정 결과</h3>
      <p><strong>감정:</strong> {emotionResult.emotion}</p>
      <p><strong>계산식:</strong></p>
      <code style={{ whiteSpace: "pre-wrap", backgroundColor: "#e9ecef", padding: "0.5rem", display: "block" }}>
        {emotionResult.calculation}
      </code>
    </div>
  );
}

export default EmotionLog;