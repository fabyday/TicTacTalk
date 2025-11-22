import { useEffect, useRef } from "react";
import { LoginForm } from "../auth/LoginForm";

export interface LoginPageProps {
  bannerUrl?: string;
  onLogin?: (id: string, password: string) => Promise<boolean>;
  onRegister?: () => Promise<void>;
  onFindAccount?: () => Promise<void>;
}

export function LoginPage({ bannerUrl, onLogin, onRegister, onFindAccount }: LoginPageProps) {
  const bgRef = useRef<HTMLDivElement>(null);
  const imageUrl = bannerUrl;

  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });

  const initialScale = 1.2; //
  const intensity = 20; //

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * intensity;
      const y = (e.clientY / innerHeight - 0.5) * intensity;

      target.current.x = x;
      target.current.y = y;
    };

    const updateOrigin = () => {
      if (!bgRef.current) return;
      const isMobile = window.innerWidth < 768; // 모바일 기준
      const originY = isMobile ? 50 : 60; // 모바일: 중앙, 데스크톱: 허리(60%)
      bgRef.current.style.transformOrigin = `center ${originY}%`;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", updateOrigin);
    updateOrigin(); // 초기 실행

    let animationFrame: number;
    const animate = () => {
      current.current.x += (target.current.x - current.current.x) * 0.1;
      current.current.y += (target.current.y - current.current.y) * 0.1;

      if (bgRef.current) {
        // translate는 scale 보정
        bgRef.current.style.transform = `translate(${current.current.x / initialScale}px, ${
          current.current.y / initialScale
        }px) scale(${initialScale})`;
      }

      animationFrame = requestAnimationFrame(animate);
    };
    animationFrame = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", updateOrigin);
      cancelAnimationFrame(animationFrame);
    };
  }, []);
  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center">
      {/* background */}
      <div
        ref={bgRef}
        className="absolute inset-0 bg-cover bg-center blur-sm will-change-transform wave-bg"
        style={{ backgroundImage: `url(${imageUrl})` }}
      />
      {/* gray overlay */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
      <div className="relative z-10 flex flex-col items-center gap-8">
        <h1 className="text-6xl md:text-8xl  font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 drop-shadow-lg select-none">
          {"TicTacTalk"}
        </h1>
        {/* LoginPages */}
        <div className="bg-white/20 backdrop-blur-lg rounded-xl p-1 ">
          <div className="z-10">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
