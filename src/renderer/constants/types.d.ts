export interface AppRouteConfig {
  name: string;
  path: string;
  mainviewComponent: React.ComponentType<any>;
  sidebarComponent?: React.ComponentType<any> | undefined;
  isFullLayout?: boolean;
}
