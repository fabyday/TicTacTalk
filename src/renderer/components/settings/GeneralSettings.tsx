import React, { useState } from "react";
import { useSettings } from "../../hooks/useSettings";
import { Pannel } from "../common/Pannel";
import { useTranslation } from "react-i18next";
import { ListSelect } from "../common/ListSelect";
import { ListSelectItem } from "../common/ListSelectItem";
import { CheckBox } from "../common/CheckBox";
import { RadioButtonGroup } from "../common/RadioButtonGroup";

export function GeneralSettings() {
  const {
    theme,
    language,
    notifications,
    autoStart,
    setTheme,
    setLanguage,
    setNotifications,
    setAutoStart,
    resetToDefaults,
    getSystemLocale,
    getCurrentLanguageName,
  } = useSettings();

  const { t } = useTranslation();

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage("");

    try {
      // Zustand persist 미들웨어가 자동으로 저장하므로 별도 저장 로직 불필요
      setSaveMessage("설정이 저장되었습니다!");
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (error) {
      console.error("설정 저장 실패:", error);
      setSaveMessage("설정 저장에 실패했습니다.");
      setTimeout(() => setSaveMessage(""), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    resetToDefaults();
    setSaveMessage("기본값으로 복원되었습니다!");
    setTimeout(() => setSaveMessage(""), 3000);
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-white mb-6">{t("renderer.components.settings.GeneralSettings.Title")}</h2>

      <div className="space-y-6">
        {/* 테마 설정 */}
        <div className="bg-gray-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-3">테마</h3>
          <div className="space-y-2">
            <label className="flex items-center space-x-3">
              <input
                type="radio"
                name="theme"
                value="dark"
                checked={theme === "dark"}
                onChange={(e) => setTheme(e.target.value as "dark" | "light")}
                className="text-blue-600"
              />
              <span className="text-gray-300">다크 모드</span>
            </label>
            <label className="flex items-center space-x-3">
              <input
                type="radio"
                name="theme"
                value="light"
                checked={theme === "light"}
                onChange={(e) => setTheme(e.target.value as "dark" | "light")}
                className="text-blue-600"
              />
              <span className="text-gray-300">라이트 모드</span>
            </label>
          </div>
        </div>

        {/* Theme Setting Pannel */}
        <Pannel title={`${t("renderer.components.settings.GeneralSettings.ThemeSetting.Title")}`}>
          좋은 테마 만들어주세요
          {/* <RadioButtonGroup>

          </RadioButtonGroup> */}
        </Pannel>

        {/* Language Setting Pannel */}
        <Pannel
          title={`${t("renderer.components.settings.GeneralSettings.LanguageSetting.Title")}`}
        >
          <ListSelect>
            <ListSelectItem>
              <div>test</div>
            </ListSelectItem>
          </ListSelect>
        </Pannel>

        {/* Notification Setting Pannel */}
        <Pannel title={t("renderer.components.settings.GeneralSettings.NotificationSetting.Title")}>
          <CheckBox
            id="1"
            label={t(
              "renderer.components.settings.GeneralSettings.NotificationSetting.EnableDesktopAlarm"
            )}
            fullClickArea={true}
            onToggle={() => {}}
          />
        </Pannel>
        {/* System Setting Pannel */}
        <Pannel title={t("renderer.components.settings.GeneralSettings.SystemSetting.Title")}>
          <CheckBox
            id="1"
            label={t("renderer.components.settings.GeneralSettings.SystemSetting.EnableAutoStart")}
            fullClickArea={true}
            onToggle={() => {}}
          />
        </Pannel>

        {/* 저장 버튼들 */}
        <div className="flex justify-between items-center">
          <button
            onClick={handleReset}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            기본값으로 복원
          </button>

          <div className="flex items-center space-x-3">
            {saveMessage && (
              <span
                className={`text-sm ${
                  saveMessage.includes("실패") ? "text-red-400" : "text-green-400"
                }`}
              >
                {saveMessage}
              </span>
            )}
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors duration-200"
            >
              {isSaving ? "저장 중..." : "설정 저장"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}



GeneralSettings.titleKey = "renderer.components.settings.GeneralSettings.Title"
