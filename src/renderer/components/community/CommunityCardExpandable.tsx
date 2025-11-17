import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type ImageLike = string | File | Blob | URL | null | undefined;

export interface ServerCardExpandableProps {
  id: number;
  name: string;
  description?: string;
  banner?: ImageLike;
  onlineCount: number;
  memberCount: number;
  onJoin?: () => Promise<void> | void;
  joined?: boolean;
  joining?: boolean;
  className?: string;
  objectPosition?: string; // "50% 30%" 같은 포커스
}

export default function ServerCardExpandable({
  id,
  name,
  description,
  banner,
  onlineCount,
  memberCount,
  onJoin,
  joined = false,
  joining,
  className = "",
  objectPosition = "50% 50%",
}: ServerCardExpandableProps) {
  const [src, setSrc] = useState<string | undefined>();
  const [open, setOpen] = useState(false);
  const [joiningLocal, setJoiningLocal] = useState(false);
  const isJoining = joining ?? joiningLocal;

  useEffect(() => {
    if (!banner) { setSrc(undefined); return; }
    if (typeof banner === "string") { setSrc(banner); return; }
    if (banner instanceof URL) { setSrc(banner.toString()); return; }
    const url = URL.createObjectURL(banner);
    setSrc(url);
    return () => URL.revokeObjectURL(url);
  }, [banner]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    const orig = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = orig; };
  }, [open]);

  async function handleJoin(e?: React.MouseEvent) {
    e?.stopPropagation(); // ← 카드 클릭 전파 차단
    if (!onJoin || joined || isJoining) return;
    try {
      setJoiningLocal(true);
      await onJoin();
    } finally {
      setJoiningLocal(false);
    }
  }

  const btnLabel = joined ? "Joined" : isJoining ? "Joining..." : "Join";

  return (
    <>
      {/* 카드 (축소 상태) — 전체 클릭 가능 */}
      <motion.div
        layoutId={`server-${id}-frame`}
        className={`w-72 rounded-2xl overflow-hidden border border-white/10 bg-black/30 hover:border-white/20 hover:shadow
          transition-colors select-none cursor-pointer ${className}`}
        title={name}
        role="button"
        tabIndex={0}
        onClick={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen(true);
          }
        }}
      >
        {/* 배너 */}
        <div className="relative aspect-[16/9] bg-gray-800 overflow-hidden">
          {src ? (
            <motion.img
              layoutId={`server-${id}-img`}
              src={src}
              alt={`${name} banner`}
              className="h-full w-full object-cover"
              style={{ objectPosition }}
              onError={() => setSrc(undefined)}
            />
          ) : (
            <div className="h-full w-full" aria-hidden="true" />
          )}

          {/* 우상단 Join (전파 차단됨) */}
          <div className="absolute top-2 right-2">
            <button
              type="button"
              onClick={handleJoin}
              disabled={!onJoin || joined || isJoining}
              aria-pressed={joined}
              className={`px-3 py-1.5 rounded-lg text-sm transition
                ${joined ? "bg-white/10 text-white/70 cursor-default"
                         : "bg-[rgb(var(--color-primary,59_130_246))] text-white hover:opacity-90"}
                disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {btnLabel}
            </button>
          </div>
        </div>

        {/* 본문(여기도 카드 래퍼 onClick에 포함) */}
        <div className="p-3 space-y-1.5">
          <h3 className="text-white font-semibold leading-tight truncate">{name}</h3>
          {description ? (
            <p className="text-sm text-white/70 max-h-10 overflow-hidden [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical]">
              {description}
            </p>
          ) : (
            <p className="text-sm text-white/40 italic">No description</p>
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
      </motion.div>

      {/* 모달 (확대 상태) */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="overlay"
            className="fixed inset-0 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div
              layoutId={`server-${id}-frame`}
              className="absolute left-1/2 top-1/2 w-[min(960px,calc(100vw-2rem))] max-h-[90vh] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl bg-[rgb(var(--color-bg,17_24_39))] text-[rgb(var(--color-fg,241_245_249))] shadow-2xl ring-1 ring-black/10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-[320px] bg-gray-800 overflow-hidden">
                {src ? (
                  <motion.img
                    layoutId={`server-${id}-img`}
                    src={src}
                    alt={`${name} banner large`}
                    className="h-full w-full object-cover"
                    style={{ objectPosition }}
                  />
                ) : (
                  <div className="h-full w-full" aria-hidden="true" />
                )}
                <button
                  onClick={() => setOpen(false)}
                  className="absolute top-3 right-3 rounded-lg bg-black/40 text-white px-3 py-1.5 text-sm hover:bg-black/60"
                >
                  Close
                </button>
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/50 to-transparent" />
              </div>

              <div className="p-5 grid gap-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold">{name}</h3>
                  <button
                    type="button"
                    onClick={handleJoin}
                    disabled={!onJoin || joined || isJoining}
                    className={`px-4 py-2 rounded-lg text-sm transition
                      ${joined ? "bg-white/10 text-white/70 cursor-default"
                               : "bg-[rgb(var(--color-primary,59_130_246))] text-white hover:opacity-90"}
                      disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {btnLabel}
                  </button>
                </div>

                {description && (
                  <p className="text-sm opacity-80 leading-relaxed">{description}</p>
                )}

                <div className="flex items-center gap-3 text-sm opacity-80">
                  <span className="inline-flex items-center gap-1">
                    <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
                    Online {onlineCount.toLocaleString()}
                  </span>
                  <span className="opacity-40">/</span>
                  <span>Total {memberCount.toLocaleString()}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
