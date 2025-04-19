export function Titlebar() {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = e.currentTarget;
    btn.classList.add("scale-90");
    setTimeout(() => {
      btn.classList.remove("scale-90");
    }, 150);
  };

  return (
    <div
      className="h-8 flex justify-end items-center px-2 bg-gray-800 select-none"
      style={{ WebkitAppRegion: "drag" } as React.CSSProperties}
    >
      <div
        className="flex gap-2"
        style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}
      >
        <button
          onClick={handleClick}
          className="w-8 h-6 hover:bg-gray-700 transition-transform duration-150 ease-in-out"
        >
          ─
        </button>
        <button
          onClick={handleClick}
          className="w-8 h-6 hover:bg-gray-700 transition-transform duration-150 ease-in-out"
        >
          ☐
        </button>
        <button
          onClick={handleClick}
          className="w-8 h-6 hover:bg-red-600 transition-transform duration-150 ease-in-out"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
