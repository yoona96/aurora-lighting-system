import React, { useEffect, useState } from "react";

function LiveEmotionPlayer({ onEmotionChange, interval = 5000 }) {
  const [emotion, setEmotion] = useState("보통");

  useEffect(() => {
    const fetchEmotion = async () => {
      try {
        const response = await fetch("https://<your-render-url>/analyze-emotion", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            heartRate: 90,      // ★ 임시값: 나중에 Fitbit OAuth 연동되면 교체
            spo2: 97,
            calories: 5.2,
            activityLevel: 2
          })
        });

        const data = await response.json();
        setEmotion(data.emotion);
        onEmotionChange(data.emotion);
      } catch (err) {
        console.error("감정 요청 실패:", err);
      }
    };

    fetchEmotion(); // 최초 1회 호출
    const intervalId = setInterval(fetchEmotion, interval); // 주기적 호출

    return () => clearInterval(intervalId);
  }, [interval, onEmotionChange]);

  return <div>현재 감정 상태: {emotion}</div>;
}

export default LiveEmotionPlayer;

// import React, { useEffect, useState } from "react";

// function LiveEmotionPlayer({ onEmotionChange, interval = 5000 }) {
//   const [emotion, setEmotion] = useState("보통");

//   useEffect(() => {
//     console.log("🔍 LiveEmotionPlayer MOUNTED");
//     const BACKEND_URL = "https://aurora-lighting-system.onrender.com";

//     let token = new URLSearchParams(window.location.search).get("access_token");

//     if (token) {
//       console.log("✅ 쿼리에서 토큰 추출됨:", token);
//       localStorage.setItem("access_token", token);
//       // URL에서 토큰 제거
//       window.history.replaceState({}, document.title, window.location.pathname);
//     } else {
//       token = localStorage.getItem("access_token");
//       console.log("ℹ️ localStorage에서 불러온 토큰:", token);
//     }

//     if (!token) {
//       console.warn("❌ access_token 없음");
//       return;
//     }

//     const fetchEmotion = async () => {
//       try {
//         const response = await fetch(`${BACKEND_URL}/emotion-now`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ access_token: token }),
//         });

//         const data = await response.json();
//         console.log("🎯 emotion-now 응답:", data);
//         setEmotion(data.emotion);
//         onEmotionChange(data.emotion);
//       } catch (err) {
//         console.error("감정 요청 실패:", err);
//       }
//     };

//     fetchEmotion();
//     const intervalId = setInterval(fetchEmotion, interval);
//     return () => clearInterval(intervalId);
//   }, [interval, onEmotionChange]);

//   return <div>현재 감정 상태: {emotion}</div>;
// }

// export default LiveEmotionPlayer;
