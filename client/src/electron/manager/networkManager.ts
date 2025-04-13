import * as dgram from "dgram";
import { WindowManager } from "./windowManager";

class NetworkManager {
  private NetworkManager() {}
  protected static __instance: NetworkManager | null = null;

  static async getInstance() {
    if (NetworkManager.__instance) {
      NetworkManager.__instance = new NetworkManager();
    }
    return NetworkManager.__instance;
  }

  async connect() {
    const udp = dgram.createSocket("udp4");
    let window = await (await WindowManager.getInstance()).getWindow();
    udp.on("message", (msg: Buffer) => {
      window.webContents.send("opus-data", msg.buffer); // ArrayBuffer로 전송
    });

    udp.bind(5005);
  }
}
