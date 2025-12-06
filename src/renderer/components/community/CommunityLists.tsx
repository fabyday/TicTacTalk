// import React from "react";

// export interface CommunityListsProps {}

// export function CommunityLists({}: CommunityListsProps) {
//   return (
//     <div>

//     </div>
//   );
// }

import React, { useState, useRef, useLayoutEffect } from "react";
import {
  DndContext,
  useDroppable,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
  UniqueIdentifier,
  DragMoveEvent,
  pointerWithin,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";
import { CommunityIcon, CommunityIconProps } from "./CommunityIcon";

export interface CommunityListsProps {
  communityItemLists: CommunityIconProps[];
  onClicked?: () => void;
  onChanged?: (communityList: CommunityIconProps[]) => void;
}

const HoverDelay = 500;
let hoverTimer: NodeJS.Timeout | null = null;
let lastHoverId: UniqueIdentifier | null = null;

export function CommunityLists({ communityItemLists, onClicked, onChanged }: CommunityListsProps) {
  // this means string | number | null
  const [indicatorIndex, setIndicatorIndex] = useState<null | number>(null);

  // 디붕씨 제가 진짜 active 아이템이에요오오 저 위에는 가.짜에오...
  const [activeItemId, setActiveItemId] = useState<UniqueIdentifier | null>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [isDragging, setDragging] = useState(false);

  // const sensors = useSensors(useSensor(PointerSensor));
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastHoverIdRef = useRef<UniqueIdentifier | null>(null);

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveItemId(active.id);
    setDragging(true);
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setDragging(false);
    setActiveItemId(null);
    setIndicatorIndex(null);

    if (!over || active.id === over.id) return;

    if (over.id.toString().startsWith("indicator")) {
      const newIndex = Number((over.id as string).split("-")[1]);
      const oldIndex = communityItemLists.findIndex((i) => i.id === active.id);
      onChanged?.(arrayMove(communityItemLists, oldIndex, newIndex));
    }
    // const newIndex = communityItemLists.findIndex((i) => i.id === over.id);
  };
  // when ESC Clicked
  const handleDragCancel = ({}) => {
    setDragging(false);
    setActiveItemId(null);
    setIndicatorIndex(null);
  };
  const handleDragAbort = ({}) => {
    //TODO
  };
  const clearHoverTimer = () => {
    // lastHoverId = null;
    lastHoverIdRef.current = null;
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimer = null;
      hoverTimerRef.current = null;
    }
  };
  const createFolder = (overId: UniqueIdentifier, activeId: UniqueIdentifier) => {
    onChanged;
  };
  const handelDragOver = ({ activatorEvent, active, collisions, delta, over }: DragMoveEvent) => {
    if (!over) {
      clearHoverTimer();
      return;
    }

    if (over.id.toString().startsWith("indicator")) {
      const index = Number((over.id as string).split("-")[1]);
      const currentIndex = communityItemLists.findIndex((i) => i.id === active.id);
      if (index === currentIndex || index === currentIndex + 1) {
        return;
      }
      setIndicatorIndex(index);
      return;
    } else if (over.id.toString().startsWith("item")) {
      // check Item
      // 새로운 droppable 위로 이동했으면 타이머 초기화
      if (lastHoverId !== over.id) {
        clearHoverTimer();
        lastHoverId = over.id;

        hoverTimer = setTimeout(() => {
          createFolder(over.id, active.id);
        }, HoverDelay);
      }
    }

    setIndicatorIndex(null);
  };

  const handleDragMove = ({ activatorEvent, active, collisions, delta, over }: DragMoveEvent) => {};

  return (
    <div>
      <DndContext
        collisionDetection={pointerWithin}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragMove={handleDragMove}
        onDragOver={handelDragOver}
        onDragCancel={handleDragCancel}
        onDragAbort={handleDragAbort}
      >
        <SortableContext
          items={communityItemLists.map((i) => i.id!)}
          strategy={verticalListSortingStrategy}
        >
          {communityItemLists.map((i, idx) => {
            return (
              <React.Fragment key={`group-${i}-${idx}`}>
                {
                  <IndicatorBar
                    id={`indicator-${idx}`}
                    key={`indicator-${idx}`}
                    visible={indicatorIndex === idx}
                  />
                }
                <div
                  ref={(el) => {
                    itemRefs.current[idx] = el;
                  }}
                  key={`fragment-${i.id}`}
                >
                  <SortableItem
                    id={`item-${i.id}`}
                    isActive={activeItemId === i.id}
                    isDragging={isDragging}
                    key={`sortable-${i.id}`}
                  >
                    <CommunityIcon {...i} />
                  </SortableItem>
                </div>
                {idx === communityItemLists.length - 1 && (
                  <IndicatorBar
                    id={`indicator-${idx + 1}`}
                    key={`indicator-${idx + 1}`}
                    visible={indicatorIndex === communityItemLists.length}
                  />
                )}
              </React.Fragment>
            );
          })}
        </SortableContext>

        <DragOverlay
          dropAnimation={{ duration: 500, easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)" }}
        >
          {activeItemId && (
            <CommunityIcon
              {...communityItemLists[communityItemLists.findIndex((i) => i.id === activeItemId)]}
            />
          )}
        </DragOverlay>

        {/* <SortableDirectory id={"asd"} isExpanded={true}>
          {communityItemLists.map((i, idx) => {
            return (
              <div
                ref={(el) => {
                  itemRefs.current[idx] = el;
                }}
                key={`fragment-${i.id}`}
              >
                <SortableItem
                  id={`item-${i.id}`}
                  isActive={activeItemId === i.id}
                  isDragging={isDragging}
                  key={`sortable-${i.id}`}
                >
                  <CommunityIcon {...i} />
                </SortableItem>
              </div>
            );
          })}
        </SortableDirectory> */}



      </DndContext>
    </div>
  );
}

interface IndicatorBarProps {
  id: UniqueIdentifier;
  size?: number; // px
  visible?: boolean;
}
function IndicatorBar({ id, size = 10, visible = false }: IndicatorBarProps) {
  const { setNodeRef } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      style={{ height: size }}
      className={`rounded-2xl p-2  ${
        visible ? "border-2 border-blue-400 bg-blue-400/10" : "bg-transparent"
      } animate-pulse`}
    ></div>
  );
}

interface CommunityItemProps {
  id: string;
  isActive?: boolean;
  isDragging?: boolean;
  children?: React.ReactNode;
}

function SortableItem({ id, isActive = false, isDragging = false, children }: CommunityItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: id,
  });

  const measureRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);

  useLayoutEffect(() => {
    if (measureRef.current) {
      const rect = measureRef.current.getBoundingClientRect();
      setSize({ width: rect.width, height: rect.height });
    }
  }, [children]);

  if (isActive) {
    return (
      <div
        ref={setNodeRef}
        style={{ width: size?.width || 20, height: size?.height || 20 }}
        {...attributes}
        {...listeners}
        className="p-1 bg-amber-900 border-2 rounded-2xl"
      />
    );
  }

  const style = {
    transform: isDragging ? undefined : CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={(e) => {
        setNodeRef(e);
        measureRef.current = e;
      }}
      style={{ display: "inline-block", ...style }}
      {...attributes}
      {...listeners}
      className="p-1"
    >
      {children}
    </div>
  );
}

/**
 *
 * Will Draw first 4 children Icons on Directory Box Icon
 * @param children this consider as Array of Children
 * @example
 *
 * <SortableDirectory>
 * <Item/>
 * <Item/>
 * <Item/>
 * <Item/>
 * </SortableDirectory>
 */

interface SortableDirectoryProps extends CommunityItemProps {
  numIcons?: number;
  isExpanded?: boolean;
}

function SortableDirectory({
  id,
  isActive = false,
  isDragging = false,
  children,
  numIcons = 4,
  isExpanded = false,
}: SortableDirectoryProps) {
  const measureRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);

  const childrenArray = React.Children.toArray(children);
  const childrenArraylength = childrenArray.length;

  // If Expanded
  if (isExpanded) {
    return (
      <div
        className=" relative w-12 
        h-30
        rounded-[20%]
       border-0 p-0
      ring-3
      ring-gray-500
      ring-offset-2 
      ring-offset-gray-200
       bg-neutral-200 "
      >
        {/* {children} */}
      </div>
    );
  }

  const position = [
    { x: "20%", y: "20%" }, // top left
    { x: "80%", y: "20%" }, // bottom left
    { x: "20%", y: "80%" }, // top right
    { x: "80%", y: "80%" }, // bottom right
  ];

  let selectedChildren = childrenArray;
  if (childrenArraylength > numIcons) {
    // It only draw first 4 items
    selectedChildren = childrenArray.slice(0, numIcons);
  }

  const result = selectedChildren.map((item, index) => {
    const pos = position[index];
    return (
      <div
        key={`directory-${id}-${index}`}
        style={{
          position: "absolute",
          left: pos.x,
          top: pos.y,
          pointerEvents: "none",
          transform: "translate(-50%, -50%) scale(0.45)", // it help to move children to center coords
          transformOrigin: "center",
        }}
      >
        {item}
      </div>
    );
  });

  return (
    <div
      className=" relative w-10 h-10
      rounded-[20%] border-0 p-0
      ring-3
      ring-gray-500
      ring-offset-2 
      ring-offset-gray-200
      overflow-hidden bg-neutral-200 "
    >
      {result}
    </div>
  );
}
