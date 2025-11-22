import {
  Children,
  cloneElement,
  isValidElement,
  ReactElement,
  ReactNode,
  useState,
} from "react";
import { ListSelectItemProps } from "./ListSelectItem";

export interface ListSelectProps {
  children:
    | ReactElement<ListSelectItemProps>[]
    | ReactElement<ListSelectItemProps>;
  multiple?: boolean;
}
export function ListSelect({ children, multiple = false }: ListSelectProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<any>(multiple ? [] : null);

  const handleSelect = (value: any) => {
    if (multiple) {
      setSelected((prev: any[]) =>
        prev.includes(value)
          ? prev.filter((v) => v !== value)
          : [...prev, value]
      );
    } else {
      setSelected(value);
      setOpen(false);
    }
  };

  return (
    <div className="relative w-60">
      <button
        className="w-full p-2 bg-gray-700 text-white rounded flex justify-between"
        onClick={() => setOpen(!open)}
      >
        <span>{multiple ? selected.join(", ") : selected ?? "선택하세요"}</span>
        <span>▼</span>
      </button>

      {open && (
        <ul className="absolute left-0 right-0 mt-1 bg-gray-700 text-white rounded shadow-lg overflow-hidden">
          {Children.map(children, (child) => {
            if (!isValidElement(child)) return child; // 안전 처리

            return cloneElement(child, {
              onSelect: handleSelect,
              selected: multiple
                ? selected.includes(child.props.value)
                : selected === child.props.value,
            });
          })}
        </ul>
      )}
    </div>
  );
}
