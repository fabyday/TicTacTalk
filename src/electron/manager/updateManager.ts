class UpdateManager {
  private UpdateManager() {}
  protected static __instance: UpdateManager | null = null;

  static async getInstance() {
    if (UpdateManager.__instance) {
      UpdateManager.__instance = new UpdateManager();
    }
    return UpdateManager.__instance;
  }

  async getPreReleases() {}
  async getStableRelease() {}
}
