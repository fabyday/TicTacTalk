class AppManager {
  constructor() {}

  /**
   * init once
   */
  async initialize(): Promise<boolean> {
    return true;
  }
}

export const AppManager = new AppManager();
