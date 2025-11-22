import { useTranslation } from "react-i18next";
import { CheckBox } from "../common/CheckBox";

export interface LoginForm {
  bgColor?: string;
  LoginBtnColor?: string;
  RegisterBtnColor?: string;
  FindAccountBtnColor?: string;
  onSubmit?: (id?: string, password?: string) => void;
  register?: () => Promise<void>;
  findAccount?: () => Promise<void>;
  onAutoLogin?: () => {};
}

export function LoginForm({ bgColor }: LoginForm) {
  const { t } = useTranslation();
  return (
    <div className="space-y-2.5">
      {/* Login Form */}
      <form className="flex items-stretch gap-2">
        <div className="flex flex-col space-y-2 flex-1">
          <input
            type="text"
            placeholder={t("renderer.components.auth.IdPlaceholder")}
            className="p-2 text-white rounded-lg border border-black focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <input
            type="password"
            placeholder={t("renderer.components.auth.PasswordPlaceholder")}
            className="p-2 text-white rounded-lg border border-black focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
        <div className="flex flex-col w-1/3  ">
          <button className="bg-blue-500 rounded-lg  text-white hover:bg-blue-600 p-2 flex-1 ">
            {t("renderer.components.auth.LoginButton")}
          </button>
        </div>
      </form>

      {/* Register Button */}
      <div className="flex flex-col gap-1 items-center">
        <button
          className=" w-full
                  text-black
                  hover:text-white
                  hover:bg-gradient-to-r from-transparent via-blue-700 to-transparent
                  transition-all duration-400 ease-in-out"
        >
          {t("renderer.components.auth.RegisterButton")}
        </button>
        <button
          className="    relative w-full
                      text-black
                      hover:text-white
                      hover:bg-gradient-to-r from-transparent via-blue-700 to-transparent
                      transition-all duration-400 ease-in-out"
        >
          {t("renderer.components.auth.FindAccountButton")}
        </button>

        {/* AutoLogin Btn */}
        <div className="w-full flex justify-between">
          <CheckBox
            id=""
            label={t("renderer.components.auth.AutoLoginButton")}
            fullClickArea={true}
          ></CheckBox>
          <CheckBox
            id=""
            label={t("renderer.components.auth.ShowPassword")}
            fullClickArea={true}
          ></CheckBox>
        </div>
      </div>

      {/* Find User Id/pwd Button */}
    </div>
  );
}
