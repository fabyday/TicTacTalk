// src/features/server/components/ServerCard.tsx
import { useEffect, useState } from "react";

type ImageLike = string | File | Blob | URL | null | undefined;

export interface CommunityCardProps {
  id: number;
  name: string;
  description?: string;
  banner?: ImageLike; // URL | File | Blob | URL
  onlineCount: number;
  memberCount: number;
  className?: string;
  onClick?: () => void;
}

export function CommunityCard({
  name,
  description,
  banner,
  onlineCount,
  memberCount,
  className = "",
  onClick,
}: CommunityCardProps) {
  const [src, setSrc] = useState<string | undefined>();

  useEffect(() => {
    if (!banner) {
      setSrc(undefined);
      return;
    }
    if (typeof banner === "string") {
      setSrc(banner);
      return;
    }
    if (banner instanceof URL) {
      setSrc(banner.toString());
      return;
    }
    const url = URL.createObjectURL(banner); // File | Blob
    setSrc(url);
    return () => URL.revokeObjectURL(url);
  }, [banner]);

  return (
    <div
      onClick={onClick}
      className={`w-72 rounded-2xl overflow-hidden border border-white/10 bg-black/30 hover:border-white/20 hover:shadow
        transition-colors cursor-pointer select-none ${className}`}
      title={name}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : -1}
    >
      {/* 배너: 고정 크기 (16:9) */}
      <div className="relative aspect-[16/9] bg-white/5">
        {src ? (
          <img
            src={src}
            alt={`${name} 배너`}
            className="h-full w-full object-cover object-top"
            loading="lazy"
            decoding="async"
            onError={() => setSrc(undefined)}
          />
        ) : (
          <div className="h-full w-full grid place-items-center text-white/50 text-sm">
            No banner
          </div>
        )}
        {/* 상단 미세 그라데이션 */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/0 via-black/0 to-black/10" />
      </div>

      {/* 본문 */}
      <div className="p-3 space-y-1.5">
        <h3 className="text-white font-semibold leading-tight truncate">
          {name}
        </h3>
        {description ? (
          // line-clamp-2 쓰려면 Tailwind line-clamp 플러그인 사용
          <p className="text-sm text-white/70 max-h-10 overflow-hidden [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical]">
            {description}
          </p>
        ) : (
          <p className="text-sm text-white/40 italic">설명이 없습니다</p>
        )}
        <div className="pt-1 flex items-center gap-2 text-xs text-white/70">
          <span className="inline-flex items-center gap-1">
            <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
            {onlineCount.toLocaleString()}
          </span>
          <span className="text-white/30">/</span>
          <span>{memberCount.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
