import { useState } from "react";

export interface ToggleSwitchProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  size?: "sm" | "md"; 
}

export function ToggleSwitch({
  checked = false,
  onChange,
  size = "md",
}: ToggleSwitchProps) {
  const [isOn, setIsOn] = useState(checked);

  const width = size === "sm" ? 40 : 56;
  const height = size === "sm" ? 20 : 28;
  const knobSize = size === "sm" ? 16 : 24;
  const padding = 2; 

  const handleToggle = () => {
    setIsOn(!isOn);
    onChange?.(!isOn);
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`relative inline-flex items-center rounded-full transition-colors duration-300 ${
        isOn ? "bg-blue-500" : "bg-gray-600"
      }`}
      style={{ width, height }}
    >
      <span
        className={`absolute top-1/2 transform -translate-y-1/2 bg-white rounded-full shadow-md transition-all duration-300`}
        style={{
          width: knobSize,
          height: knobSize,
          left: isOn ? width - knobSize - padding : padding,
        }}
      />
    </button>
  );
}
