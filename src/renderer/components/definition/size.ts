// size converter and predefined data

// const predefinedSizeMap: Record<Size, number> = {
//   IconSize: {width : 16},
//   md: 16,
// };

export type ScalarSizeType = string | number;
export type WHSizeType = { wdith: ScalarSizeType; height: ScalarSizeType };

export function SizeConverter(size: WHSizeType) {}

export type Size = "xs" | "sm" | "md" | "lg" | "xl";

type ObjectName = string;

export const TTKSizeMap: Record<ObjectName, Record<ObjectName, WHSizeType> | WHSizeType> = {
  CommunityIconSize: { wdith: "32", height: "32" },
};
