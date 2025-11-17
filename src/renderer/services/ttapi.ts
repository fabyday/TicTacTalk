import { io, Socket } from "socket.io-client";
import "./types";
import * as T3types from "./types";
import { ChannelType, T3Error } from "./types/serverManipulationTypes";
import { T3CommunityOp } from "./ops/communityOps";

/**
 *
 */

export class T3Server {
  m_server_url: string | null;
  m_port: string;
  m_socket: T3types.T3Sock | null;
  m_accesss_token: string;

  m_communityCahche: Map<number, T3types.Community>;

  constructor(serverurl?: string, port?: string, lazy_mode: boolean = true) {
    this.m_server_url = serverurl ?? null;
    this.m_socket = null;
    this.m_accesss_token = "";
    this.m_communityCahche = new Map();
    this.m_port = port ?? "9999";
    if (!lazy_mode) {
      this.connect();
    }
  }

  _initializeBeforeConnect() {
    if (typeof this.m_socket == null) {
      if (!this.m_server_url) {
        return Error("server URL is NULL.");
      }
      this.m_socket = io(this.m_server_url, { port: `${this.m_port}` });
    } else {
      if (this.m_socket?.connected) {
        // do nothing
      } else {
        if (!this.m_server_url) {
          return Error("server URL is NULL.");
        }
        this.m_socket = io(this.m_server_url, { autoConnect: false });
      }
    }
  }

  /**
   * Registers a callback for a custom socket event.
   *
   * @typeParam E - Event name (string key of `TTTtypes.TTTSockListenEvents`).
   * @param eventName - The event name to listen to.
   * @param callback - Listener matching `TTTtypes.TTTSockListenEvents[E]`.
   * @example
   * addCallbackOnSock("lis", () => { console.log("lis!"); });
   * @remarks
   * Reserved events ("connect", "disconnect", "connect_error") should be handled separately.
   */
  addCallbackOnSock<
    E extends Extract<keyof T3types.TTTSockListenEvents, string>
  >(eventName: E, callback: T3types.TTTSockListenEvents[E]): void {
    if (this.m_socket != null) {
      this.m_socket?.on(eventName, callback);
    }
  }

  addCallbacksOnSock() {}

  connect() {
    this._initializeBeforeConnect();
  }

  async login(
    credentials: T3types.LoginRequest
  ): Promise<T3types.LoginResponse> {
    return await this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  async testConnection(): Promise<boolean> {
    try {
      console.log(`🔍 서버 연결 테스트: ${this.m_server_url}/auth/profile`);
      const response = await fetch(`${this.m_server_url}/auth/profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log(
        `📥 연결 테스트 응답: ${response.status} ${response.statusText}`
      );

      // 401은 토큰이 없어서 발생하는 정상적인 응답
      // 404는 엔드포인트가 존재하지 않는 경우
      const isConnected =
        response.status === 401 || response.status === 404 || response.ok;
      console.log(`🔗 연결 상태: ${isConnected ? "성공" : "실패"}`);

      return isConnected;
    } catch (error) {
      console.error(`💥 연결 테스트 실패:`, error);
      return false;
    }
  }

  async register(
    userData: T3types.RegisterRequest
  ): Promise<T3types.RegisterResponse> {
    return this.request("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async getProfile(): Promise<T3types.UserProfile> {
    return this.request("/auth/profile", {
      method: "GET",
    });
  }

  async request<T extends keyof T3types.ApiResponseMap>(
    endpoint: T,
    opts: RequestInit = {}
  ): Promise<T3types.ApiResponseMap[T]> {
    const url = `${this.m_server_url}/${endpoint}`;
    console.log(`🌐 API 호출: ${url}`);
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...((opts.headers as Record<string, string>) || {}),
    };

    if (this.m_accesss_token) {
      headers["Authorization"] = `Bearer ${this.m_accesss_token}`;
    }

    const config: RequestInit = { ...opts, headers };
    const response = await fetch(url, config);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return (await response.json()) as T3types.ApiResponseMap[T];
  }

  /**
   * get Community List
   */
  async getPublicComminityList() {
    try {
      const result = await this.request("/chat/community/public", {
        method: "GET",
      });
      console.log("✅ 공개 커뮤니티 조회 성공:", result);
      return result;
    } catch (error) {
      console.error("❌ 공개 커뮤니티 조회 실패:", error);
      throw error;
    }
  }

  /**
   *
   * @param communityId
   * @returns
   */

  async createCommunity(communityName: string) {
    this.request("/chat/community", {
      method: "POST",
      body: JSON.stringify({
        name: communityName,
      }),
    });
  }

  async getCommunity(communityId: number): Promise<T3CommunityOp> {
    let community = this.m_communityCahche.get(communityId);
    if (typeof community === "undefined") {
      let s: T3types.CreateCommunityRequest = {
        name: "",
      };
      community = await this.request("/chat/community", {
        method: "GET",
        body: JSON.stringify({
          name: communityId,
        }),
      });
    }

    return new T3CommunityOp(this, community);

    // if (!(await community.valid())) {
    //   throw {
    //     msg: "Community Info Not Valid",
    //     code: "NotExisted",
    //   } satisfies T3Error;
    // }
    // return community;
  }
}
