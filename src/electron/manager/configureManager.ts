export class ConfigureManager {
  private ConfigureManager() {}
  protected static __instance: ConfigureManager | null = null;

  static async getInstance() {
    if (ConfigureManager.__instance) {
      ConfigureManager.__instance = new ConfigureManager();
    }
    return ConfigureManager.__instance;
  }
}
