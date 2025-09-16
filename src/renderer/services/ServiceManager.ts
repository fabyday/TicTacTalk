import { T3StorageFactory } from "./storage";

/**
 *
 */
export class ServiceManager {
  private m_storage;
  protected _initialize() {
    this.m_storage = T3StorageFactory();
    
  }
}
