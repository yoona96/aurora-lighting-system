import React, { useEffect, useState } from "react";
import axios from "axios";

const FIXED_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyM1FIWlMiLCJzdWIiOiJDSzlHM0giLCJpc3MiOiJGaXRiaXQiLCJ0eXAiOiJhY2Nlc3NfdG9rZW4iLCJzY29wZXMiOiJyb3h5IHJociByYWN0IiwiZXhwIjoxNzQ4MzczMDM1LCJpYXQiOjE3NDgzNDQyMzV9.T7ihLAKdhpKWJv4zE3nxAslmAfBWUb-ScLIXaTgo0-M";

function LiveEmotionPlayer({ onEmotionChange, interval = 5000 }) {
  const [emotion, setEmotion] = useState("보통");
  const [log, setLog] = useState([]);

  const logPush = (msg) => setLog((prev) => [...prev, msg]);

  const getToday = () => new Date().toISOString().split("T")[0];
  const headers = { Authorization: `Bearer ${FIXED_TOKEN}` };

  const getHeartRate = async () => {
    try {
      const url = `https://api.fitbit.com/1/user/-/activities/heart/date/${getToday()}/1d/1min.json`;
      const res = await axios.get(url, { headers });
      const series = res.data["activities-heart-intraday"]?.dataset || [];
      logPush(`💓 심박수 데이터 수신 (${series.length}개)`);
      return series.length ? series.at(-1).value : null;
    } catch (e) {
      logPush("❌ 심박수 가져오기 실패");
      return null;
    }
  };

  const getSpO2 = async () => {
    try {
      const url = "https://api.fitbit.com/1/user/-/spo2/date/today.json";
      const res = await axios.get(url, { headers });
      const value = res.data?.spo2?.value ?? 97;
      logPush(`🩸 SpO₂ 수신: ${value}`);
      return value;
    } catch (e) {
      logPush("❌ SpO₂ 가져오기 실패, 97로 대체");
      return 97;
    }
  };

  const getActivityLevel = async () => {
    try {
      const url = `https://api.fitbit.com/1/user/-/activities/date/${getToday()}.json`;
      const res = await axios.get(url, { headers });
      const sum = res.data.summary;
      const { lightlyActiveMinutes = 0, fairlyActiveMinutes = 0, veryActiveMinutes = 0 } = sum;
      const level = veryActiveMinutes > 30 ? 3 : fairlyActiveMinutes > 30 ? 2 : lightlyActiveMinutes > 30 ? 1 : 0;
      logPush(`🏃 활동량 수신: level ${level}`);
      return level;
    } catch (e) {
      logPush("❌ 활동량 가져오기 실패, 0으로 대체");
      return 0;
    }
  };

  const getCalories = async () => {
    try {
      const url = `https://api.fitbit.com/1/user/-/activities/date/${getToday()}.json`;
      const res = await axios.get(url, { headers });
      const caloriesPerMin = (res.data.summary?.caloriesOut || 4320) / (24 * 60);
      logPush(`🔥 칼로리 수신: ${caloriesPerMin.toFixed(2)} cal/min`);
      return caloriesPerMin;
    } catch (e) {
      logPush("❌ 칼로리 가져오기 실패, 3.0으로 대체");
      return 3.0;
    }
  };

  const inferEmotion = (hr, spo2, calories, activity) => {
    if (hr >= 88 && spo2 >= 96) return "집중";
    if (hr >= 85 && calories >= 4.0) return "집중";
    if (hr >= 92 && spo2 < 95) return "스트레스";
    if (hr < 72 && spo2 >= 96) return "이완";
    if (hr < 68 && spo2 < 95) return "피로";
    return "보통";
  };

  useEffect(() => {
    const fetchEmotion = async () => {
      logPush("📡 감정 분석 시작");

      const hr = await getHeartRate();
      const spo2 = await getSpO2();
      const cal = await getCalories();
      const act = await getActivityLevel();

      const result = inferEmotion(hr, spo2, cal, act);
      setEmotion(result);
      onEmotionChange(result);
      logPush(`✅ 감정 판별: ${result}`);
    };

    fetchEmotion(); // 최초 호출
    const id = setInterval(fetchEmotion, interval);
    return () => clearInterval(id);
  }, [interval, onEmotionChange]);

  return (
    <div style={{ padding: "20px", fontFamily: "monospace" }}>
      <h3>현재 감정 상태: {emotion}</h3>
      <h4>📋 로그 출력</h4>
      <ul style={{ textAlign: "left", whiteSpace: "pre-wrap" }}>
        {log.map((line, i) => (
          <li key={i}>{line}</li>
        ))}
      </ul>
    </div>
  );
}

export default LiveEmotionPlayer;
