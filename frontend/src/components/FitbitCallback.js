import React, { useEffect } from "react";

function FitbitCallback() {
  useEffect(() => {
    let token =
      new URLSearchParams(window.location.search).get("access_token") ||
      new URLSearchParams(window.location.hash.substring(1)).get("access_token");

    if (token) {
      //console.log("✅ access_token 추출됨:", token);
      // 👉 이게 핵심: /로 이동하면서 쿼리로 token 넘김
      window.location.href = `/?access_token=${token}`;
    } else {
      alert("❌ access_token이 없습니다.");
    }
  }, []);

  return <div>로그인 처리 중...</div>;
}

export default FitbitCallback;
