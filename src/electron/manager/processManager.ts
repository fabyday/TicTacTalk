class ProcessManager {
  private ProcessManager() {}
  protected static __instance: ProcessManager | null = null;

  static async getInstance() {
    if (ProcessManager.__instance) {
      ProcessManager.__instance = new ProcessManager();
    }
    return ProcessManager.__instance;
  }
}
