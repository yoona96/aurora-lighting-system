import React, { useEffect } from "react";

function FitbitCallback() {
  useEffect(() => {
    // URL 쿼리 파라미터 확인
    const queryParams = new URLSearchParams(window.location.search);
    let token = queryParams.get("access_token");

    // 또는 해시(#)로 넘어온 경우 처리
    if (!token && window.location.hash) {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      token = hashParams.get("access_token");
    }

    if (token) {
      localStorage.setItem("access_token", token);
      alert("✅ 로그인 완료!");
      window.location.href = "/";
    } else {
      alert("❌ access_token이 없습니다.");
    }
  }, []);

  return <div>로그인 처리 중...</div>;
}

export default FitbitCallback;
