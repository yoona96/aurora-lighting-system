import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LightingDisplay from "./components/LightingDisplay";
// import CSVEmotionPlayer from "./components/CSVEmotionPlayer";
import LiveEmotionPlayer from "./components/LiveEmotionPlayer";
import FitbitCallback from "./components/FitbitCallback";

function App() {
  // useEffect(() => {
  //   const queryParams = new URLSearchParams(window.location.search);
  //   let token = queryParams.get("access_token");

  //   if (!token && window.location.hash) {
  //     const hashParams = new URLSearchParams(window.location.hash.substring(1));
  //     token = hashParams.get("access_token");
  //   }

  //   if (token) {
  //     localStorage.setItem("access_token", token);
  //     window.history.replaceState({}, document.title, "/");
  //   }
  // }, []);

  const [emotion, setEmotion] = useState("보통");

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <h1>오로라 라이팅 시스템</h1>
              <LiveEmotionPlayer onEmotionChange={setEmotion} interval={5000} />
              <LightingDisplay emotion={emotion} />
            </>
          }
        />
        <Route path="/callback" element={<FitbitCallback />} />
      </Routes>
    </Router>
  );
}

export default App;