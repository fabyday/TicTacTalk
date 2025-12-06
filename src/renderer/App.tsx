import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LayoutRouter } from "./LayoutRouter";
import { appManager } from "./services/AppManager";

export default function App() {
  useEffect(() => {
    const res = appManager.initialize();
    res.then(async (res: boolean) => {});
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Settings 전체 페이지 갈아끼우기 */}
        <Route path="/settings/*" element={<SettingPage />} />

        {/* 나머지는 고정 레이아웃 (sidebar 포함) */}
        <Route path="/*" element={<LayoutRouter />} />
      </Routes>
    </BrowserRouter>
  );
}
