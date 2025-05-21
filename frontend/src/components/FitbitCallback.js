import React, { useEffect } from "react";

function FitbitCallback() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("access_token");

    if (token) {
      localStorage.setItem("access_token", token);
      alert("✅ 로그인 완료!");
      window.location.href = "/";  // 홈으로 돌아감
    } else {
      alert("❌ access_token이 없습니다.");
    }
  }, []);

  return <div>로그인 처리 중...</div>;
}

export default FitbitCallback;
