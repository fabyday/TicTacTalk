import { useState } from "react";

export interface CheckBoxProps {
  id?: string;
  label?: string;
  checked?: boolean;
  fullClickArea?: boolean;
  onToggle?: (checked: boolean) => void;
}

export function CheckBox({
  id,
  label,
  checked = false,
  fullClickArea = false,
  onToggle,
}: CheckBoxProps) {
  const [isChecked, setChecked] = useState(checked);

  const checkCallback = () => {
    setChecked(!isChecked);
    onToggle?.(isChecked);
  };

  return (
    <label
      className="flex items-center space-x-2 cursor-pointer select-none"
      onClick={fullClickArea ? checkCallback : undefined} // 전체 영역 클릭 가능
    >
      <div
        className={`
          w-5 h-5 border rounded-md flex items-center justify-center
          transition-colors duration-200
          ${isChecked ? "bg-blue-500 border-blue-500" : "bg-gray-700 border-gray-500"}
          hover:border-blue-400 hover:bg-gray-600
        `}
        onClick={fullClickArea ? undefined : checkCallback} // 박스만 클릭 가능
      >
        {isChecked && (
          <svg
            className="w-3 h-3 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      <span className="text-white text-sm">{label}</span>
    </label>
  );
}
