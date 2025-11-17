import { MouseEvent, useEffect, useRef, useState } from "react";
import { ChannelItem } from "./ChannelItem";
import { ChevronDown, ChevronRight, CirclePlus, Cog } from "lucide-react";

export interface CategoryItemProps {
  id: string;
  name: string;
  childItems: string[];
  callbacks?: CategoryItemCallbacks;
}

export interface CategoryItemCallbacks {
  addItem?: () => void;
}

// categoryItem can expands child Items
export function CategoryItem({ id, name, childItems }: CategoryItemProps) {
  const [isOpened, setOpened] = useState(false);
  const [maxHeight, setMaxHeight] = useState("0px");
  const [outerPressed, setOuterPressed] = useState(false);

  const childComponents = [
    <div className="p-1">
      <ChannelItem channelName={"ss"} itemType={"chat"} authorized={true} />
    </div>,
    <div className="p-1">
      <ChannelItem channelName={"ss"} itemType={"chat"} authorized={true} />
    </div>,
  ];
  const mapa = childComponents.map((child, index) => (
    <div
      key={index}
      className={`transform transition-all duration-500 ease-out
                  ${
                    isOpened
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-4"
                  }`}
      style={{ transitionDelay: `${index * 50}ms` }}
    >
      {child}
    </div>
  ));

  useEffect(() => {
    if (!contentRef.current) return;
    if (isOpened) {
      setMaxHeight(contentRef.current.scrollHeight + "px");
    } else {
      setMaxHeight("0px");
    }
  }, [isOpened, childComponents]);

  const adminBtn = (
    <div className="inner-btn bg-gray-800">
      <button
        // onClick={innerClickEventWrapper(activeSetting!)}
        onMouseDown={(e) => {
          e.stopPropagation();
        }}
        className="p-1
            rounded-full 
                shadow-[0_4px_8px_rgba(0,0,0,0.35)]              
                bg-transparent text-gray-500

                hover:bg-gray-200 hover:text-gray-800
                hover:shadow-[0_6px_18px_rgba(0,0,0,0.85)]
                hover:scale-[1.3]
                
                transition-all duration-300 ease-out
                active:scale-95 
            "
      >
        <CirclePlus size={16} strokeWidth={3} />
      </button>
      <button
        className="p-1
            
            rounded-full 
                shadow-[0_4px_8px_rgba(0,0,0,0.35)]              
                bg-transparent text-gray-500

                hover:bg-gray-200 hover:text-gray-800
                hover:shadow-[0_6px_18px_rgba(0,0,0,0.85)]
                hover:scale-[1.3]
                
                transition-all duration-300 ease-out
                active:scale-95 
            "
        // onClick={innerClickEventWrapper(activeSetting!)}
      >
        <Cog size={16} strokeWidth={3} />
      </button>
    </div>
  );

  const contentRef = useRef<HTMLDivElement>(null);
  return (
    <div>
      {/* category name name  */}
      <div
        role="button"
        className="
        rounded-2xl
        flex justify-between
        items-center
        bg-amber-700
        p-1
      "
        onClick={(e: MouseEvent) => {
          console.log(outerPressed);
        }}
        onMouseDown={(e: MouseEvent<HTMLDivElement>) => {
          const isInner = (e.target as HTMLElement).closest(".inner-btn");
          if (!isInner) {
            console.log("outer pressed");
            setOuterPressed(true);
          }
        }}
        onMouseUp={() => {
          if (outerPressed) {
            console.log("outer clicked");
            setOpened(!isOpened);
          }
          setOuterPressed(false);
          console.log("outer relased");
        }}
        onMouseLeave={() => {
          setOuterPressed(false);

          console.log("outer relased");
        }}
      >
        <div className="flex p-1 items-center">
          <p className=" select-none p-1">{name}</p>
          <ChevronRight
            className={`
            transition-transform duration-300
            ${isOpened ? "rotate-90 translate-y-0.5" : ""}`}
          />
        </div>
        <div className="p-1">{adminBtn}</div>
      </div>
      {/* components */}

      <div
        className={`overflow-hidden transition-all duration-300
            `}
        ref={contentRef}
        style={{
          maxHeight,
        }}
      >
        {childComponents}
      </div>
    </div>
  );
}
