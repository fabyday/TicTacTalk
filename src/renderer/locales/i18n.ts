import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
import path from "path";




// this is TODO 
// remove hard-coded lines
import kr from "../../../locales/kr.json";
import en from "../../../locales/en.json";
i18n
  .use(initReactI18next)
  //   .use(LanguageDetector)

  .init({
    lng: "kr",
    fallbackLng: "kr",
    debug: true,
    resources: {
      kr: { translation: kr },
      en: { translation: en },
    //   en: { translation: en },
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
