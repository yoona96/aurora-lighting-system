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
  if (!emotionResult || !emotionResult.calculation) return null;

  return (
    <div style={{ marginTop: "20px", padding: "10px", backgroundColor: "#f9f9f9", borderRadius: "8px" }}>
      <h4>감정 계산 과정</h4>
      <p><strong>감정 결과:</strong> {emotionResult.emotion}</p>
      <pre style={{ backgroundColor: "#eee", padding: "10px", borderRadius: "5px" }}>
        {emotionResult.calculation}
      </pre>
    </div>
  );
}

export default EmotionLog;