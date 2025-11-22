import React from "react";

export interface PannelProps {
  title?: string;
  children?: React.ReactNode;
}

export function Pannel({ title, children }: PannelProps) {
  return (
    <div className="bg-gray-700 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-white mb-3">{title}</h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}
