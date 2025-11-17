import React from "react";

export interface GuideLineProps {
  guideText?: string;
  lineColor?: string;
  textColor?: string;
}

export function GuideLine({ guideText, lineColor, textColor }: GuideLineProps) {
  const defaultColor = "gray-700";
  console.log(textColor);
  const divider = (
    <div
      style={
        { "--line-color": lineColor ?? defaultColor } as React.CSSProperties
      }
      className={`flex-1 h-[1px] bg-[var(--line-color)]`}
    ></div>
  );
  const textAndDiv = guideText
    ? [
        <span
          style={
            { "--text-color": textColor ?? defaultColor } as React.CSSProperties
          }
          className={`leading-none select-none px-3 text-xs text-[var(--text-color)] font-semibold whitespace-nowrap`}
        >
          {guideText}
        </span>,
        divider,
      ]
    : undefined;
  return (
    <div className="flex items-center my-4">
      {divider}
      {textAndDiv}
    </div>
  );
}
