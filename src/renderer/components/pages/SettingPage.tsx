import { useState } from "react";
import { GeneralSettings } from "../settings/GeneralSettings";
import { useTranslation } from "react-i18next";

type id = string;

export interface SettingViewItem {
  settingView: Record<id, React.ReactNode>;
}

export interface SettingPageProps {
  key?: string;
  settingViews: Record<id, React.ReactNode>;
  onSave?: () => Promise<void>;
  onResetDefault?: () => Promise<void>;
}

export function SettingPage({ key, settingViews }: SettingPageProps) {
  const [menuIdx, setMenuIdx] = useState(key ?? Object.keys(settingViews)[0]);
  const { t } = useTranslation();
  settingViews![""];

  return (
    <div className="flex gap-1 sm:gap-2 md:gap-3 lg:gap-4">
      {/* left list Panel */}

      <div className=" w-1/3 space-x-1">
        <ul>
          {Object.keys(settingViews).map((key) => (
            <li
              key={key}
              className={`text-white p-2 cursor-pointer hover:bg-gray-700 rounded 
                ${menuIdx === key ? "bg-gray-700 font-bold" : ""}   `}
              onClick={() => {
                setMenuIdx(key);
              }}
            >
              {t(key) || "Unkown"}
            </li>
          ))}
        </ul>
      </div>
      {/* right Panel */}
      <div className="flex w-full m-3">{settingViews[menuIdx]}</div>
    </div>
  );
}
