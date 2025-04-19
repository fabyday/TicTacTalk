class ShortcutManager {
  private ShortcutManager() {}
  protected static __instance: ShortcutManager | null = null;

  static async getInstance() {
    if (ShortcutManager.__instance) {
      ShortcutManager.__instance = new ShortcutManager();
    }
    return ShortcutManager.__instance;
  }
}
