import React from "react";

/**
 * CommunityIcon
 * - 크기: "sm" | "md"
 * - 알림 배지: notificationCount > 0일 때만 우측하단에 원형으로 표시 (99+ 처리)
 * - 작은 아이콘(sm): 마우스 호버 시 흰색 외곽선 표시
 * - 크기별 위젯: widget prop에 ReactNode 또는 렌더 함수 제공 시 아이콘 옆에 표시
 */
export type CommunityIconProps = {
  size?: "sm" | "md";
  /** 아이콘 이미지 경로 (있으면 사용, 없으면 이니셜 렌더) */
  iconSrc?: string;
  /** 이미지가 없을 때 표기할 이니셜(예: "CA") */
  initials?: string;
  /** 0 또는 undefined/null이면 배지 숨김 */
  notificationCount?: number | null;
  /** 아이콘 클릭 핸들러 (옵션) */
  onClick?: () => void;
  /** 접근성 라벨 (버튼) */
  ariaLabel?: string;
  /** 추가 클래스 */
  className?: string;
  /**
   * 크기별로 다른 위젯을 배치할 수 있도록 제공하는 슬롯
   * - ReactNode 또는 (size) => ReactNode 형태
   * - 아이콘의 오른쪽에 자동 배치됨
   */
  widget?: React.ReactNode | ((size: "sm" | "md") => React.ReactNode);
};

export function CommunityIcon({
  size = "sm",
  iconSrc,
  initials,
  notificationCount,
  onClick,
  ariaLabel = "Community Icon",
  className,
  widget,
}: CommunityIconProps) {
  const dim = size === "sm" ? "w-8 h-8" : "w-12 h-12"; // sm: 32px, md: 48px
  const textSize = size === "sm" ? "text-xs" : "text-base";

  const badgeText = formatBadge(notificationCount);
  const hasBadge = !!badgeText;

  const widgetNode =
    typeof widget === "function"
      ? (widget as (s: "sm" | "md") => React.ReactNode)(size)
      : widget;

  return (
    <span className="relative inline-block w-10 h-10">
      <button
        className="
        // transition duration-300 ease-in-out // for button ease out
      relative w-full h-full
      rounded-[20%] border-0 p-0
      ring-3
      ring-gray-500
      ring-offset-2 
      ring-offset-gray-200
      overflow-hidden bg-neutral-200
    "
        aria-label="Community"
      >
        {iconSrc ? (
          <img alt="" src={iconSrc} className="w-full h-full object-cover" />
        ) : (
          initials
        )}
      </button>
      {badgeText ? (
        <span className="absolute -right-1.5 -bottom-1.5 pointer-events-none">
          {/* 배지 크기 기준 컨테이너 */}
          {/* <span className="relative inline-flex items-center justify-center min-w-4 h-4 px-1"> */}
          <span className="relative inline-flex items-center justify-center min-w-4 h-4 px-1">
            {/* 1) 항상 은은한 발광(블러) */}
            {/* <span className="absolute inset-0 rounded-full bg-red-600 opacity-50 blur-[4px]" /> */}
            <span className="absolute -inset-0.5 rounded-full bg-red-600 opacity-35 blur-[6px]" />
            {/* 2) 살짝 퍼지는 핑 효과(기본 Tailwind 애니메이션) */}

            <span className="absolute inset-0 rounded-full bg-red-600 opacity-30 animate-ping" />

            {/* 실제 숫자 배지 */}
            {/* 버튼 밖으로 살짝 겹치는 배지 */}

            <span
              className="
      absolute -right-1.5 -bottom-1.5
      min-w-4 h-4 px-1 py-0
      rounded-full bg-red-600 text-white text-[10px]
      flex items-center justify-center
      ring-2 ring-gray-500
      pointer-events-none
       overflow-hidden
    "
            >
              {badgeText}
              <span
                className="pointer-events-none absolute inset-0 rounded-full
    bg-[radial-gradient(55%_45%_at_72%_10%,rgba(255,255,255,0.9)_0%,rgba(255,255,255,0.35)_40%,transparent_60%)]
    mix-blend-screen"
              />
            </span>
          </span>
        </span>
      ) : undefined}
    </span>
  );
  return (
    <div className="static">
      <button
        type="button"
        className=" bg-gray-400"
        aria-label={ariaLabel}
        onClick={onClick}
        draggable={false}
      >
        <img
          src="./main.jpg"
          alt=""
          className="pointer-events-none object-cover w-32 h-32 rounded-4xl"
        ></img>
        <div className="pointer-events-none object-cover w-4 h-4 absolute bottom-1 right-1 items-center inline-flex">
          <span>10</span>
        </div>
      </button>
    </div>
  );
}

function formatBadge(count?: number | null): string | null {
  if (count == null || count <= 0) return null;
  if (count > 99) return "99+";
  return String(count);
}
