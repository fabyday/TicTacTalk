import { T3Server } from "./ttapi";

class ConnectionManager {
  servers: Record<string, T3Server>;
  constructor() {
    this.servers = {};
  }

  async connectToServer(
    url: string,
    port?: string | number
  ): Promise<T3Server> {
    return new T3Server(url);
  }

  async saveServerToDisk() {}

  async loadServerFromDisk() {}

  findServerByName() {}

  findServerByUUID() {}
}
