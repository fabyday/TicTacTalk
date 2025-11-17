import { Cog, Ellipsis, Smile } from "lucide-react";

interface MessageProps {
  id: number;
  content: string;
  textChannelId: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: number;
    username: string;
  };
}

function EditFrame() {
  return (
    <div className="p-1 gap-1 flex">
      <button
        className="rounded-full 
      
      transition-all hover:scale-110 active:scale-90 bg-gray-500"
      >
        <Smile color="white"></Smile>
      </button>
      <button
        className=" rounded-full 
      transition-all hover:scale-110 active:scale-90 bg-gray-500"
      >
        <Ellipsis color="white"></Ellipsis>
      </button>
    </div>
  );
}

// export function MessageFrame(){

// }

// export function MessageHeader(){

// }

// export function MessageBlock({
//   id,
//   content,
//   textChannelId,
//   userId,
//   createdAt,
//   updatedAt,
//   user,
export function MessageBlock({
  data,
}: {
  data: MessageProps | MessageProps[];
}) {
  let messageItem = null;
  let userName = null;
  let createdAt = null;
  let id = null;
  if (Array.isArray(data) && data.length > 0) {
    // if array
    createdAt = data[0].createdAt;
    userName = data[0].user?.username;
    messageItem = data.map((e) => {
      return (
        <div
          className="text-sm text-gray-200 whitespace-pre-wrap p-2
          
        "
        >
          {e.content}
        </div>
      );
    });
  } else {
    //  Message Object type
    const prop: MessageProps = data as MessageProps;
    userName = prop.user?.username;
    id = prop.id;
    messageItem = (
      <div className="text-sm text-gray-200 whitespace-pre-wrap p-2">
        {prop.content}
      </div>
    );
    createdAt = prop.createdAt;
  }

  return (
    <div key={id} className=" flex items-start space-x-3">
      <button className="transform-all active:translate-y-0.5 duration-100">
        <div className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center text-sm font-bold text-white">
          {userName?.charAt(0).toUpperCase() || "U"}
        </div>
      </button>
      <div className="flex-1">
        <div className="flex  items-center space-x-2 mb-1">
          <button className="transform-all active:scale-90 duration-100">
            <span className="text-sm font-bold text-white">
              {userName ?? "알 수 없음"}
            </span>
          </button>
          <span className="text-xs text-gray-400">
            {new Date(createdAt).toLocaleString()}
          </span>

          <div>
            <EditFrame />
          </div>
        </div>
        {messageItem}
      </div>
    </div>
  );
}
