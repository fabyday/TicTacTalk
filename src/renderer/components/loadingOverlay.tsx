import React, { useState, useEffect } from 'react';

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
  type?: 'login' | 'general';
}

export default function LoadingOverlay({ isVisible, message = "로딩 중...", type = 'general' }: LoadingOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [fadeIn, setFadeIn] = useState(false);

  const loginSteps = [
    "서버에 연결 중...",
    "인증 확인 중...",
    "사용자 정보 로드 중...",
    "메인 화면으로 이동 중..."
  ];

  useEffect(() => {
    if (isVisible) {
      setFadeIn(true);
      setCurrentStep(0);
      
      if (type === 'login') {
        const interval = setInterval(() => {
          setCurrentStep(prev => {
            if (prev < loginSteps.length - 1) {
              return prev + 1;
            }
            return prev;
          });
        }, 400); // 각 단계별 400ms

        return () => clearInterval(interval);
      }
    } else {
      setFadeIn(false);
    }
  }, [isVisible, type]);

  if (!isVisible) return null;

  const currentMessage = type === 'login' ? loginSteps[currentStep] : message;

  return (
    <div className={`fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-500 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
      <div className={`bg-gray-800/95 rounded-2xl p-8 flex flex-col items-center space-y-6 shadow-2xl border border-gray-700 transition-all duration-300 ${fadeIn ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
        {/* 로딩 GIF */}
        <div className="relative">
          <img 
            src="../../images/loading.gif" 
            alt="Loading" 
            className="w-20 h-20 rounded-full object-cover"
            style={{
              filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))',
            }}
          />
          {/* 추가적인 글로우 효과 */}
          <div className="absolute inset-0 w-20 h-20 rounded-full bg-blue-400/20 animate-pulse"></div>
        </div>
        
        {/* 로딩 메시지 */}
        <div className="text-center">
          <p className="text-white font-medium text-lg transition-all duration-300">{currentMessage}</p>
          
          {/* 진행률 표시 (로그인 시에만) */}
          {type === 'login' && (
            <div className="mt-4 w-48 bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${((currentStep + 1) / loginSteps.length) * 100}%` }}
              ></div>
            </div>
          )}
          
          {/* 점 애니메이션 */}
          <div className="flex space-x-1 mt-3">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
} 