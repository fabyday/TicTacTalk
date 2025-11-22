import React, { useState, useEffect } from "react";

export interface LoadingComponentProps {
  isVisible?: boolean;
  message?: string;
  progress?: { progress: number; max: number };
  progressAnimationGif: string;
  progressBarType?: "ring" | "bar" | "none";
  bgColor?: string; // tailwind class
  barColor?: string; // tailwind class
  size?: { width: number; height: number };
  sizeClass?: string; // Tailwind class
}

export function LoadingComponent({
  isVisible = true,
  message = "로딩 중...",
  progress,
  progressAnimationGif,
  progressBarType = "none",
  bgColor = "bg-black/60",
  barColor = "bg-blue-500",
  size,
  sizeClass,
}: LoadingComponentProps) {
  const [fadeIn, setFadeIn] = useState(false);
  const [displayMessage, setDisplayMessage] = useState(message);

  useEffect(() => {
    if (isVisible) {
      setFadeIn(true);
    } else {
      setFadeIn(false);
    }
  }, [isVisible]);

  // 메시지가 변경될 때 부드러운 트랜지션
  useEffect(() => {
    setDisplayMessage(message);
  }, [message]);

  if (!isVisible) return null;

  const percentage = progress && progress.max > 0 ? (progress.progress / progress.max) * 100 : 0;

  return (
    <div
      className={`
        fixed inset-0 ${bgColor} backdrop-blur-sm 
        flex items-center justify-center z-50
        transition-opacity duration-500
        ${fadeIn ? "opacity-100" : "opacity-0"}
      `}
    >
      <div
        className={`
          bg-gray-800/95 rounded-2xl p-8 
          flex flex-col items-center space-y-6 
          shadow-2xl border border-gray-700 
          transition-all duration-300
          ${fadeIn ? "scale-100 opacity-100" : "scale-95 opacity-0"}
          relative ${sizeClass || ""}
        `}
        style={size ? { width: size.width, minHeight: size.height } : undefined} // 원하는 고정 사이즈
      >
        {/* GIF */}
        <div className="relative">
          <img
            src={progressAnimationGif}
            alt="loading"
            className="w-20 h-20 rounded-full object-cover"
            style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.3))" }}
          />
          <div className="absolute inset-0 w-20 h-20 rounded-full bg-blue-400/20 animate-pulse"></div>
        </div>

        {/* 메시지 */}
        <p
          className="
            text-white font-medium text-lg 
            transition-opacity duration-300
          "
        >
          {displayMessage}
        </p>

        {/* 프로그레스 타입 */}
        {progressBarType === "bar" && progress && (
          <div className="mt-4 w-48 bg-gray-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${barColor}`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        )}

        {progressBarType === "ring" && (
          <div className="w-12 h-12 border-4 border-gray-600 border-t-blue-400 rounded-full animate-spin"></div>
        )}

        {/* 점 애니메이션 */}
        <div className="flex space-x-1 mt-3">
          <div
            className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
            style={{ animationDelay: "0ms" }}
          />
          <div
            className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
            style={{ animationDelay: "150ms" }}
          />
          <div
            className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
            style={{ animationDelay: "300ms" }}
          />
        </div>
      </div>
    </div>
  );
}
