// import React, { useEffect, useState, useRef } from "react";

// function EmotionController({ onEmotionChange, interval = 5000 }) {
//   const [emotion, setEmotion] = useState("보통");
//   const [token, setToken] = useState(null);
//   const [manualOverride, setManualOverride] = useState(false);
//   const [timeLeft, setTimeLeft] = useState(0);
//   const overrideTimer = useRef(null);
//   const countdownInterval = useRef(null);

//   useEffect(() => {
//     const queryParams = new URLSearchParams(window.location.search);
//     let extractedToken = queryParams.get("access_token");

//     if (!extractedToken && window.location.hash) {
//       const hashParams = new URLSearchParams(window.location.hash.substring(1));
//       extractedToken = hashParams.get("access_token");
//     }

//     setToken(extractedToken);

//     const fetchEmotion = async () => {
//       try {
//         const response = await fetch("https://aurora-lighting-system.onrender.com/emotion-now", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ access_token: extractedToken })
//         });

//         if (!response.ok) return;

//         const data = await response.json();

//         if (!manualOverride) {
//           setEmotion(data.emotion);
//           onEmotionChange(data.emotion);
//         }
//       } catch (err) {
//         // 무시
//       }
//     };

//     if (extractedToken) {
//       fetchEmotion();
//       const intervalId = setInterval(fetchEmotion, interval);
//       return () => clearInterval(intervalId);
//     }
//   }, [interval, onEmotionChange, manualOverride]);

//   const handleManualEmotion = (selectedEmotion) => {
//     setManualOverride(true);
//     clearTimeout(overrideTimer.current);
//     clearInterval(countdownInterval.current);

//     setEmotion(selectedEmotion);
//     onEmotionChange(selectedEmotion);

//     setTimeLeft(60);
//     countdownInterval.current = setInterval(() => {
//       setTimeLeft((prev) => {
//         if (prev <= 1) {
//           clearInterval(countdownInterval.current);
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     overrideTimer.current = setTimeout(() => {
//       setManualOverride(false);
//     }, 60000);
//   };

//   const emotions = ["이완", "스트레스", "집중", "피로", "긍정", "보통"];

//   return (
//     <div>
//       <h3 style={{ marginBottom: "10px" }}>감정 선택 또는 실시간 감정 반영</h3>

//       <div style={{ marginBottom: "15px", fontWeight: "bold", color: manualOverride ? "#d35400" : "#2c3e50" }}>
//         {manualOverride
//           ? `✋ 수동 모드 (자동 복귀까지 ${timeLeft}초)`
//           : "🔄 자동 감정 수신 중"}
//       </div>

//       <div style={{
//         display: "flex",
//         justifyContent: "center",
//         flexWrap: "wrap",
//         gap: "10px"
//       }}>
//         {emotions.map((emo) => (
//           <button
//             key={emo}
//             onClick={() => handleManualEmotion(emo)}
//             style={{
//               padding: "10px 20px",
//               fontSize: "1rem",
//               borderRadius: "8px",
//               border: "1px solid #ccc",
//               backgroundColor: "#fff",
//               cursor: "pointer",
//               boxShadow: "1px 1px 5px rgba(0,0,0,0.1)"
//             }}
//           >
//             {emo}
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default EmotionController;

import React, { useEffect, useState, useRef } from "react";
import EmotionLog from "./EmotionLog"; // 👈 새로 만든 로그 컴포넌트 불러오기

function EmotionController({ onEmotionChange, interval = 5000 }) {
  const [emotion, setEmotion] = useState("보통");
  const [emotionResult, setEmotionResult] = useState(null);  // ✅ 감정 + 계산식 저장
  const [token, setToken] = useState(null);
  const [manualOverride, setManualOverride] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const overrideTimer = useRef(null);
  const countdownInterval = useRef(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    let extractedToken = queryParams.get("access_token");

    if (!extractedToken && window.location.hash) {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      extractedToken = hashParams.get("access_token");
    }

    setToken(extractedToken);

    const fetchEmotion = async () => {
      try {
        const response = await fetch("https://aurora-lighting-system.onrender.com/emotion-now", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ access_token: extractedToken })
        });

        if (!response.ok) return;

        const data = await response.json();

        if (!manualOverride) {
          setEmotion(data.emotion);
          setEmotionResult(data);  // ✅ 감정 + 계산식 저장
          onEmotionChange(data.emotion);
        }
      } catch (err) {
        console.error("감정 불러오기 실패:", err);
      }
    };

    if (extractedToken) {
      fetchEmotion();
      const intervalId = setInterval(fetchEmotion, interval);
      return () => clearInterval(intervalId);
    }
  }, [interval, onEmotionChange, manualOverride]);

  const handleManualEmotion = (selectedEmotion) => {
    setManualOverride(true);
    clearTimeout(overrideTimer.current);
    clearInterval(countdownInterval.current);

    setEmotion(selectedEmotion);
    onEmotionChange(selectedEmotion);

    setTimeLeft(60);
    countdownInterval.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    overrideTimer.current = setTimeout(() => {
      setManualOverride(false);
    }, 60000);
  };

  const emotions = ["이완", "스트레스", "집중", "피로", "긍정", "보통"];

  return (
    <div>
      <h3 style={{ marginBottom: "10px" }}>감정 선택 또는 실시간 감정 반영</h3>

      <div style={{ marginBottom: "15px", fontWeight: "bold", color: manualOverride ? "#d35400" : "#2c3e50" }}>
        {manualOverride
          ? `✋ 수동 모드 (자동 복귀까지 ${timeLeft}초)`
          : "🔄 자동 감정 수신 중"}
      </div>

      <div style={{
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        gap: "10px"
      }}>
        {emotions.map((emo) => (
          <button
            key={emo}
            onClick={() => handleManualEmotion(emo)}
            style={{
              padding: "10px 20px",
              fontSize: "1rem",
              borderRadius: "8px",
              border: "1px solid #ccc",
              backgroundColor: "#fff",
              cursor: "pointer",
              boxShadow: "1px 1px 5px rgba(0,0,0,0.1)"
            }}
          >
            {emo}
          </button>
        ))}
      </div>

      {/* ✅ 계산 수식 시각화 */}
      <EmotionLog emotionResult={emotionResult} />
    </div>
  );
}

export default EmotionController;
