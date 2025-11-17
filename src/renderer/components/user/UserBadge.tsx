export interface UserBadgeProps {
  userId: string;
  userName: string;
  prefix?: string;
  description?: string;

  imgSrc?: string;
}

export function UserBadge({
  userId,
  userName,
  prefix,
  description,
  imgSrc,
}: UserBadgeProps) {
  return (
    <div className="max-w-sm h-130 mx-auto bg-amber-500 rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow">
      <div className="flex items-center p-6">
        {/* profile image */}
        {imgSrc ? (
          <img
            className="w-16 h-16 rounded-full object cover border"
            src={imgSrc}
          />
        ) : (
          <img
            className="w-16 h-16 rounded-full object cover border"
            src={"main.jpg"}
          />
        )}
        {/* userInfo */}
        <div className="ml-4">
          <h2 className="text-xl font-semibold text-gray-800">{userName}</h2>
          <p className="text-gray-500 text-sm min-h-[1em] leading-none">
            {prefix}
          </p>
        </div>
      </div>
      <div className="relative  m-3 h-[60%] rounded-2xl bg-amber-950 text-gray-300 overflow-hidden">
        {/* 바깥 패딩은 여기서 관리 */}
        <div className="h-full px-8 pt-6 pb-4">
          {/* 실제 스크롤 뷰포트 */}
          <div
            className="scroll-fade h-full overflow-y-auto pr-8 -mr-8 "
            style={{
              scrollbarGutter: "stable",
              scrollbarWidth: "auto",
            }} // 글자 위치 흔들림 방지
          >
            <p className="whitespace-pre-line text-base leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      </div>
      {/* <div className="px-6 pb-4 flex space-x-3">
        <button className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition">
          Follow
        </button>
        <button className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition">
          Message
        </button>
      </div> */}
    </div>
  );
}
