import { useRef, useState } from "react";
import { GeneralSettings } from "../settings/GeneralSettings";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

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
  const orderedKeys = Object.keys(settingViews);

  const [menuIdx, setMenuIdx] = useState(key ?? orderedKeys[0]);
  const prevIdx = useRef(orderedKeys.indexOf(menuIdx));

  const { t } = useTranslation();
  const currentIdx = orderedKeys.indexOf(menuIdx);
  const direction = currentIdx > prevIdx.current ? 1 : -1;
  prevIdx.current = currentIdx;

  return (
    <div className="flex gap-1 sm:gap-2 md:gap-3 lg:gap-4">
      {/* left list Panel */}
      <div className=" w-1/3 space-x-1">
        <ul>
          {Object.keys(settingViews).map((key) => (
            <motion.li
              key={key}
              className={`text-white p-2 cursor-pointer hover:bg-gray-700 rounded 
                ${menuIdx === key ? "bg-gray-700 font-bold" : ""}   `}
              onClick={() => {
                setMenuIdx(key);
              }}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "tween", duration: 0.25 }}
            >
              {t(key) || "Unkown"}
            </motion.li>
            // <li
            //   key={key}
            //   className={`text-white p-2 cursor-pointer hover:bg-gray-700 rounded
            //     ${menuIdx === key ? "bg-gray-700 font-bold" : ""}   `}
            //   onClick={() => {
            //     setMenuIdx(key);
            //   }}
            // >
            //   {t(key) || "Unkown"}
            // </li>
          ))}
        </ul>
      </div>
      {/* right Panel */}
      <div className="flex w-full m-3">
        <AnimatePresence mode="wait">
          <motion.div
            key={menuIdx}
            initial={{ opacity: 0, y: 30 * direction }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 * -direction }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="w-full"
          >
            {settingViews[menuIdx]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
