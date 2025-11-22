import { useTranslation } from "react-i18next";

export interface ShortcutProps {
  id: string;
  defaultKey: string;
  currentKey: string;
  editingShortcut: string | null;
  handleKeyPress: (id: string, e: any) => void;
  onReset: (shortcutId: string) => void;
  setEditingShortcut: (e: string | null) => void;
}

export function Shortcut({
  defaultKey,
  id,
  currentKey,
  editingShortcut,
  handleKeyPress,
  onReset,
  setEditingShortcut,
}: ShortcutProps) {
  const { t } = useTranslation();

  return (
    <div className="flex  items-center justify-between border-t border-b  p-1 ">
      <div className="flex shrink-1 flex-col">
        <h3 className="text-lg font-semibold text-white">{"shortcut.name"}</h3>
        <p className="text-gray-400 text-sm">{"shortcut.description"}</p>
      </div>


      <div className="flex items-center  select-none  ">
        <div className="  items-center w-[140px] px-1 ">
          <div className="text-sm text-gray-400 text-center">
            {t("renderer.components.commons.Shortcut.DefaultValue")}
          </div>
          <div className="bg-gray-600 text-white border border-blue-500 rounded  font-mono text-center ">
            {defaultKey ||
              t("renderer.components.commons.Shortcut.EmptyDefaultValue")}
          </div>
        </div>

        <div className="  items-center  w-[140px] px-1 ">
          <div className="text-sm text-center text-gray-400">
            {""}
            {t("renderer.components.commons.Shortcut.CurrentValue")}
          </div>
          {editingShortcut === id ? (
            <input
              type="text"
              className="bg-gray-600 text-white border border-blue-500  rounded  font-mono text-center w-full"
              placeholder="키 입력"
              onKeyDown={(e) => handleKeyPress(id, e)}
              onBlur={() => setEditingShortcut(null)}
              autoFocus
            />
          ) : (
            <button
              onClick={() => setEditingShortcut(id)}
              className="bg-gray-600 hover:bg-gray-500 text-white border  border-gray-500 rounded  font-mono transition-colors duration-200 w-full"
            >
              {currentKey}
            </button>
          )}
          
        </div>

        <div className="items-center w-[140px] text-center px-1">
          <button
            onClick={() => onReset(id)}
            className="  text-blue-400 rounded-sm  hover:text-blue-300 text-sm "
          >
            {t("renderer.components.commons.Shortcut.Reset")}
          </button>
        </div>
      </div>
    </div>
  );
}
