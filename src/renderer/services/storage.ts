import { Token } from "./types";

interface T3AbstractStorage {
  saveToken: () => Promise<void>;
  loadToken: () => Promise<Token>;
  saveConfig: () => Promise<void>;

  //TODO types
  loadConfig: () => Promise<void>;
  loadServerList: () => Promise<void>;
  saveServerInfoList: () => Promise<void>;
}

class T3ElectronStorage implements T3AbstractStorage {
    
  public async saveToken() {}
  public async loadToken() {
    //TODO
    return {
      accessToken: "",
      tokenType: "",
      expiresIn: "string",
      cookieOptions: {
        httpOnly: true,
        secure: true,
        sameSite: "string",
        maxAge: 1,
      },
    };
  }
  public async loadConfig() {}
  public async saveConfig() {}
  public async loadServerList() {}
  public async saveServerInfoList() {}
}

class T3WebStorage implements T3AbstractStorage {
  public async saveToken() {}
  public async loadToken() {
    //TODO
    return {
      accessToken: "",
      tokenType: "",
      expiresIn: "string",
      cookieOptions: {
        httpOnly: true,
        secure: true,
        sameSite: "string",
        maxAge: 1,
      },
    };
  }
  public async loadConfig() {}
  public async saveConfig() {}
  public async loadServerList() {}
  public async saveServerInfoList() {}
}

const isElectorn = true;
export function T3StorageFactory() {
  return isElectorn ? new T3ElectronStorage() : new T3WebStorage();
}
