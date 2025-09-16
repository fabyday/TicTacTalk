export function Titlebar() {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = e.currentTarget;
    btn.classList.add("scale-90");
    setTimeout(() => {
      btn.classList.remove("scale-90");
    }, 150);
  };

  const handleMinimize = () => {
    if (window.electronAPI) {
      window.electronAPI.minimizeWindow();
    }
  };

  const handleMaximize = () => {
    if (window.electronAPI) {
      window.electronAPI.maximizeWindow();
    }
  };

  const handleClose = () => {
    if (window.electronAPI) {
      window.electronAPI.closeWindow();
    }
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
          onClick={(e) => {
            handleClick(e);
            handleMinimize();
          }}
          className="w-8 h-6 hover:bg-gray-700 transition-transform duration-150 ease-in-out"
          title="최소화"
        >
          ─
        </button>
        <button
          onClick={(e) => {
            handleClick(e);
            handleMaximize();
          }}
          className="w-8 h-6 hover:bg-gray-700 transition-transform duration-150 ease-in-out"
          title="최대화"
        >
          ☐
        </button>
        <button
          onClick={(e) => {
            handleClick(e);
            handleClose();
          }}
          className="w-8 h-6 hover:bg-red-600 transition-transform duration-150 ease-in-out"
          title="닫기"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
