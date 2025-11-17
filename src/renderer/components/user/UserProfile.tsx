export interface UserProfileProps {
  userName: string;
  userId: number;
  description?: string;
  prefix?: string;
  imgSrc?: string;
  bannerSrc?: string;
}

export function UserProfile({
  userName,
  userId,
  description,
  prefix,
  imgSrc,
  bannerSrc,
}: UserProfileProps) {
  const sidePanel = <div className="w-[100%] flex-row bg-blue-400 ">test</div>;

  const banner = (
    <div className="w-full h-48 bg-gray-700 rounded-t-2xl">
      {bannerSrc ? (
        <img
          src={bannerSrc}
          alt="banner"
          className="w-full h-full object-cover rounded-t-2xl"
        />
      ) : (
        "dt"
      )}
    </div>
  );

  const nameBadge = (
    <div className="relative w-full bg-gray-300 flex items-center">
      <img
        src={imgSrc}
        alt="profile"
        className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
      />

      <div className="ml-3">
        <p className="text-3xl">{userName}</p>
        <p className="text-2xl text-gray-500 min-h-[1.5em] leading-none">
          {prefix}
        </p>
      </div>
    </div>
  );

  const descriptionPanel = (
    <div className="rounded-b-2xl p-3 bg-gray-300">
      <div className="whitespace-pre-line break-words">
        <p className="text-2xl p-1">{description}</p>
        <div className="flex flex-col">
          <div className="flex flex-row">
            <div className="flex flex-row items-center">
              <p className="text-sm text-amber-700 p-1">가입시기</p>
              <p className="text-xs text-amber-700 p-1">2019</p>
            </div>
            <div className="flex flex-row items-center">
              <p className="text-sm text-amber-700 p-1">가입시기</p>
              <p className="text-xs text-amber-700 p-1">2019</p>
            </div>
          </div>
          <div className="">
            <p>역할</p>
            <p>ㅅㄷㄴㅅ</p>

          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className=" w-full bg-amber-700 min-h-screen">
      <div className="relative w-full h-full flex p-2 flex-col">
        <div>{banner}</div>
        <div>{nameBadge}</div>
        <div>{descriptionPanel}</div>
      </div>
      {/* <div className="w-1/2 h-fit">{sidePanel}</div> */}
      {/* {bannerAndDesc} */}
      {/* {sidePanel} */}
    </div>
  );

  // this is future TODO
  return (
    <div className="flex w-full bg-amber-700 min-h-screen">
      <div></div>
      <div className="relative w-1/2 h-full flex p-2 flex-col">
        <div>{banner}</div>
        <div>{nameBadge}</div>
        <div>{descriptionPanel}</div>
      </div>
      {/* <div className="w-1/2 h-fit">{sidePanel}</div> */}
      {/* {bannerAndDesc} */}
      {/* {sidePanel} */}
    </div>
  );
}
