import { MainPage } from "../components/pages/MainPage";
import { AppRouteConfig } from "./types";

export const DefaultAppRoutes: Record<string, AppRouteConfig> = {
  mainview: {
    name: "mainView",
    path: "/",
    mainviewComponent: MainPage,
    sidebarComponent: undefined,
  },
  serverView: {
    name: "mainview",
    path: "/",
    mainviewComponent: MainPage,
    sidebarComponent: undefined,
  },
  settingView: {
    name: "settingView",
    path: "/settings",
    mainviewComponent: MainPage,
    sidebarComponent: undefined,
  },
};
