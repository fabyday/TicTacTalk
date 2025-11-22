import { Children, cloneElement, ReactElement, useState } from "react";
import { CheckBoxProps } from "./CheckBox";

export interface CheckBoxGroupProps {
  children: ReactElement<CheckBoxProps> | ReactElement<CheckBoxProps>[];
  onChange?: (selected: string[]) => void;
  multiple?: boolean;
  defaultSelected?: string | string[];
}
export function CheckBoxGroup({
  children,
  onChange,
  multiple = true,
  defaultSelected,
}: CheckBoxGroupProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>(() => {
    if (!defaultSelected) {
      return [];
    }
    if (Array.isArray(defaultSelected)) {
      return defaultSelected;
    } else {
      return [defaultSelected];
    }
  });

  const handleToggle = (value: string) => {
    setSelectedItems((prev) => {
      let updated: string[];
      if (multiple) {
        // 다중 선택
        updated = prev.includes(value)
          ? prev.filter((i) => i !== value)
          : [...prev, value];
      } else {
        // 단일 선택
        updated = prev.includes(value) ? [] : [value];
      }

      onChange?.(updated);
      return updated;
    });
  };

  return (
    <div className="flex flex-col space-y-2">
      {Children.map(children, (child) => {
        if (!child) return null;

        return cloneElement(child, {
          checked: selectedItems.includes(child.props.label),
          onToggle: () => handleToggle(child.props.label),
        });
      })}
    </div>
  );
}
