import { AudioLines, CirclePlus, Cog } from "lucide-react";
import { MouseEvent, MouseEventHandler, useState } from "react";
type ItemType = "chat" | "voice" ;

export interface ChannelItemProps {
  channelName: string;
  itemType: ItemType;
  authorized: boolean;
  callbacks?: ChannelItemCallback;
}

export interface ChannelItemCallback {
  click?: () => void;
  activeSetting?: () => void;
  activeAdd?: () => void;
}

export function ChannelItem({
  channelName,
  itemType,
  authorized,
  callbacks,
}: ChannelItemProps) {
  // if authorized flag is true, then add setting buttons
  let adminBtn = null;
  const [outerPressed, setOuterPressed] = useState(false);

  const { click, activeSetting, activeAdd } = callbacks ?? {};

  if (authorized) {
    const innerClickEventWrapper = (event: () => void) => {
      const onClicked = (e: MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        console.log("stop");
        // event();
      };

      return onClicked;
    };
    switch (itemType) {
      case "category":
        adminBtn = (
          <div className="inner-btn bg-gray-800">
            <button
              onClick={innerClickEventWrapper(activeSetting!)}
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
              onClick={innerClickEventWrapper(activeSetting!)}
            >
              <Cog size={16} strokeWidth={3} />
            </button>
          </div>
        );
        break;
      case "chat":
      case "voice":
        adminBtn = (
          <button>
            <Cog
              className="rounded-full 
                shadow-[0_4px_8px_rgba(0,0,0,0.35)]              
                bg-transparent text-gray-500

                hover:bg-gray-200 hover:text-gray-800
                hover:shadow-[0_6px_18px_rgba(0,0,0,0.85)]
                hover:scale-[1.3]
                
                transition-all duration-300 ease-out
                active:scale-95 
                "
              size={16}
              strokeWidth={3}
            />
          </button>
        );
        break;
    }
  }
  // if not do nothing
  return (
    <div
      role="button"
      onClick={(e: MouseEvent) => {
        console.log("outer clicked");
      }}
      onMouseDown={(e: MouseEvent) => {
        const isInner = (e.target as HTMLElement).closest(".inner-btn");
        if (!isInner) setOuterPressed(true);
      }}
      onMouseUp={() => setOuterPressed(false)}
      onMouseLeave={() => setOuterPressed(false)}
      className={`
        
    flex items-center justify-between 
    rounded-2xl bg-amber-300 hover:bg-amber-700 transition
    ${outerPressed ? "scale-95" : ""}
  `}
    >
      <div className="flex p-3 items-center justify-center">
        {itemType === "category" ? null : <AudioLines />}
        <p className="select-none pl-2 pr-2">test2</p>
        {itemType === "category" ? null : null}
      </div>
      <div className="flex items-center p-3">{adminBtn}</div>
    </div>
  );
}
