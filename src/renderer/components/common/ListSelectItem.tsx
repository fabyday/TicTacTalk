import { ReactNode } from "react";

export interface ListSelectItemProps {
  children?: ReactNode;
  value?: any;
  selected?: boolean;
  onSelect?: (value: any) => void;
}

export function ListSelectItem({
  children,
  value,
  selected,
  onSelect,
}: ListSelectItemProps) {
  return (
    <li
      onClick={() => onSelect?.(value)}
      className={`
        p-2 rounded cursor-pointer 
        ${selected ? "bg-blue-600" : "bg-gray-600"} 
        hover:bg-gray-500 transition
      `}
    >
      {children}
    </li>
  );
}
