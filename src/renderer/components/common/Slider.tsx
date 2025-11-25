import React, { useRef, useState, useEffect, useCallback } from "react";

export interface SliderProps {
  value?: number;
  minValue?: number;
  maxValue?: number;
  stepSize?: number;
  knobSize?: number;
  onChange?: (v: number) => void;
}

export function Slider({
  value = 0,
  minValue = 0,
  maxValue = 100,
  stepSize = 1,
  knobSize = 16,
  onChange,
}: SliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const [current, setCurrent] = useState(value);

  const clamp = (value: number, min: number, max: number) => {
    const MinClipedVal = Math.max(value, min);
    const MaxClipedVal = Math.min(MinClipedVal, max);
    return MaxClipedVal;
  };

  // px → value 변환 (local coord space)
  const pxToValue = useCallback(
    (px: number, width: number) => {
      const ratio = px / width;
      let v = minValue + ratio * (maxValue - minValue);

      // step 적용
      v = Math.round(v / stepSize) * stepSize;

      return clamp(v, minValue, maxValue);
    },
    [minValue, maxValue, stepSize]
  );

  // value → px transform (Local coord space)
  const valueToPx = useCallback(
    (v: number, width: number) => {
      const ratio = (v - minValue) / (maxValue - minValue);
      return ratio * width;
    },
    [minValue, maxValue]
  );

  // knob drag 처리
  const handleMove = (e: MouseEvent) => {
    if (!dragging.current || !trackRef.current) return;

    const rect = trackRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;

    const clamped = clamp(x, 0, rect.width);

    const newValue = pxToValue(clamped, rect.width);

    setCurrent(newValue);
    onChange?.(newValue);
  };

  const stopDrag = () => {
    dragging.current = false;
    document.removeEventListener("mousemove", handleMove);
    document.removeEventListener("mouseup", stopDrag);
  };

  const startDrag = (e: React.MouseEvent) => {
    dragging.current = true;
    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseup", stopDrag);

    // bar 클릭만 해도 이동
    if (trackRef.current) {
      const rect = trackRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const clamped = Math.min(Math.max(x, 0), rect.width);
      const newValue = pxToValue(clamped, rect.width);
      setCurrent(newValue);
      onChange?.(newValue);
    }
  };

  // calculate knob position
  const leftPx = trackRef.current
    ? valueToPx(current, trackRef.current.getBoundingClientRect().width)
    : 0;

  return (
    <div className="relative w-64 h-6 flex items-center">
      {/* track */}
      <div
        ref={trackRef}
        onMouseDown={startDrag}
        className="absolute left-0 top-1/2 -translate-y-1/2 h-2 w-full bg-gray-500 rounded"
      />

      {/* knob or Thumb */}
      <div
        className={`absolute bg-blue-500 rounded-sm cursor-pointer`}
        style={{
          width: knobSize,
          height: knobSize,
          left: leftPx - knobSize / 2,
          top: "50%",
          transform: "translateY(-50%)",
        }}
        onMouseDown={startDrag}
      />
    </div>
  );
}
