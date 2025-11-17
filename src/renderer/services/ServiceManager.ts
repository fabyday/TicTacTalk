import { T3AbstractStorage, T3StorageFactory } from "./storage";

/**
 *
 */
export class ServiceManager {
  private m_storage: T3AbstractStorage;
  constructor() {
    this.m_storage = T3StorageFactory();
  }
  protected _initialize() {
    this.m_storage = T3StorageFactory();
    this.m_storage.loadConfig();
  }
}
