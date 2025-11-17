import React, { useState } from "react";

export default function Modal({ children }: { children: React.ReactElement }) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      {/* 버튼 */}
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg"
      >
        Open Modal
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed  inset-0 z-50 flex items-center justify-center">
          {/* 배경 */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setOpen(false)}
          ></div>

          {/* 컨텐츠 */}
          <div className="relative h-fit w-fit bg-transparent shadow-lg  ">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            {children}
          </div>
        </div>
      )}
    </div>
  );
}
