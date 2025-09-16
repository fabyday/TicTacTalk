export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: string;
  cookieOptions: {
    httpOnly: boolean;
    secure: boolean;
    sameSite: string;
    maxAge: number;
  };
}



class ApiService {
  private baseUrl: string = "";
  private accessToken: string | null = null;

  setBaseUrl(url: string) {
    this.baseUrl = url;
  }

  setAccessToken(token: string) {
    this.accessToken = token;
  }

  clearAccessToken() {
    this.accessToken = null;
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    console.log(`🌐 API 호출: ${url}`);
    console.log(`📤 요청 데이터:`, options.body);

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...((options.headers as Record<string, string>) || {}),
    };

    if (this.accessToken) {
      headers["Authorization"] = `Bearer ${this.accessToken}`;
      console.log(`🔑 인증 토큰 사용: ${this.accessToken.substring(0, 20)}...`);
    } else {
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    try {
      console.log(`🔍 요청 시작: ${url}`);
      const response = await fetch(url, config);

      console.log(`📥 응답 상태: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;

        try {
          const errorData = await response.json();
          console.log(`❌ 에러 응답:`, errorData);
          errorMessage = errorData.message || errorMessage;
        } catch {
          console.log(`❌ JSON 파싱 실패, 기본 에러 메시지 사용`);
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log(`✅ 성공 응답:`, data);
      return data;
    } catch (error) {
      console.error(`💥 API 호출 실패:`, error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Network error occurred");
    }
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    return this.request<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: RegisterRequest): Promise<RegisterResponse> {
    return this.request("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async getProfile(): Promise<UserProfile> {
    return this.request<UserProfile>("/auth/profile", {
      method: "GET",
    });
  }

  // 서버 연결 테스트
  async testConnection(): Promise<boolean> {
    try {
      console.log(`🔍 서버 연결 테스트: ${this.baseUrl}/auth/profile`);
      const response = await fetch(`${this.baseUrl}/auth/profile`, {
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

  // 서버 상태 확인 (더 간단한 방법)
  async ping(): Promise<boolean> {
    try {
      console.log(`🏓 서버 핑 테스트: ${this.baseUrl}`);
      const response = await fetch(`${this.baseUrl}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log(
        `📥 핑 테스트 응답: ${response.status} ${response.statusText}`
      );
      const isPingable = response.ok;
      console.log(`🏓 핑 상태: ${isPingable ? "성공" : "실패"}`);

      return isPingable;
    } catch (error) {
      console.error(`💥 핑 테스트 실패:`, error);
      return false;
    }
  }

  // 커뮤니티 관련 API
  async getUserCommunities(): Promise<Membership[]> {
    console.log("🌐 getUserCommunities API 호출 시작");
    try {
      const result = await this.request<Membership[]>("/chat/community", {
        method: "GET",
      });
      console.log("✅ getUserCommunities API 응답:", result);
      return result;
    } catch (error) {
      console.error("❌ getUserCommunities API 실패:", error);
      throw error;
    }
  }

  async createCommunity(data: CreateCommunityRequest): Promise<Community> {
    return this.request<Community>("/chat/community", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // 디버그용 API
  async debugGetAllData(): Promise<any> {
    console.log("🔍 디버그 데이터 조회 시작");
    try {
      const result = await this.request<any>("/chat/community/debug/all", {
        method: "GET",
      });
      console.log("🔍 디버그 데이터:", result);
      return result;
    } catch (error) {
      console.error("❌ 디버그 데이터 조회 실패:", error);
      throw error;
    }
  }

  // 공개 커뮤니티 조회
  async getPublicCommunities(): Promise<PublicCommunity[]> {
    console.log("🔍 공개 커뮤니티 조회 시작");
    try {
      const result = await this.request<PublicCommunity[]>(
        "/chat/community/public",
        {
          method: "GET",
        }
      );
      console.log("✅ 공개 커뮤니티 조회 성공:", result);
      return result;
    } catch (error) {
      console.error("❌ 공개 커뮤니티 조회 실패:", error);
      throw error;
    }
  }

  // 모든 커뮤니티 조회 (가입 여부 포함)
  async getAllCommunitiesWithMembership(): Promise<PublicCommunity[]> {
    console.log("🔍 모든 커뮤니티 조회 시작 (가입 여부 포함)");
    try {
      const result = await this.request<PublicCommunity[]>(
        "/chat/community/all",
        {
          method: "GET",
        }
      );
      console.log("✅ 모든 커뮤니티 조회 성공:", result);
      return result;
    } catch (error) {
      console.error("❌ 모든 커뮤니티 조회 실패:", error);
      throw error;
    }
  }

  // 커뮤니티 가입
  async joinCommunity(
    communityId: number
  ): Promise<{ success: boolean; message?: string }> {
    console.log(`🚪 커뮤니티 ${communityId} 가입 시도`);
    try {
      await this.request(`/chat/community/${communityId}/join`, {
        method: "POST",
      });
      console.log(`✅ 커뮤니티 ${communityId} 가입 성공`);
      return { success: true };
    } catch (error) {
      console.error(`❌ 커뮤니티 ${communityId} 가입 실패:`, error);
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "가입에 실패했습니다.",
      };
    }
  }

  // 텍스트 채널 관련 API
  async createTextChannel(
    data: CreateTextChannelRequest
  ): Promise<TextChannel> {
    return this.request<TextChannel>("/text-channel", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getChannelsByCommunity(communityId: number): Promise<TextChannel[]> {
    return this.request<TextChannel[]>(
      `/text-channel/community/${communityId}`,
      {
        method: "GET",
      }
    );
  }

  // 디버그용 API
  async debugGetAllMessages(): Promise<Message[]> {
    console.log("🔍 디버그: 모든 메시지 조회");
    return this.request<Message[]>("/text-channel/debug/all-messages", {
      method: "GET",
    });
  }

  async debugGetChannelInfo(channelId: number): Promise<any> {
    console.log(`🔍 디버그: 채널 ${channelId} 정보 조회`);
    return this.request<any>(`/text-channel/debug/channel/${channelId}`, {
      method: "GET",
    });
  }

  // 보이스 채널 관련 API
  async createVoiceChannel(
    data: CreateVoiceChannelRequest
  ): Promise<VoiceChannel> {
    return this.request<VoiceChannel>("/voicechat/channels", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getVoiceChannelsByCommunity(
    communityId: number
  ): Promise<VoiceChannel[]> {
    return this.request<VoiceChannel[]>(
      `/voicechat/channels/community/${communityId}`,
      {
        method: "GET",
      }
    );
  }

  async getVoiceChannel(channelId: number): Promise<VoiceChannel> {
    const response = await this.request<{
      success: boolean;
      channel?: VoiceChannel;
      message?: string;
    }>(`/voicechat/channels/${channelId}`, {
      method: "GET",
    });

    if (response.success && response.channel) {
      return response.channel;
    } else {
      throw new Error(response.message || "Voice channel not found");
    }
  }

  async deleteVoiceChannel(channelId: number): Promise<void> {
    const response = await this.request<{ success: boolean; message?: string }>(
      `/voicechat/channels/${channelId}`,
      {
        method: "DELETE",
      }
    );

    if (!response.success) {
      throw new Error(response.message || "Failed to delete voice channel");
    }
  }

  // 범용 채널 생성 메서드
  async createChannel(
    data: CreateChannelRequest
  ): Promise<TextChannel | VoiceChannel> {
    if (data.type === "text") {
      return this.createTextChannel({
        name: data.name,
        communityId: data.communityId,
      });
    } else {
      return this.createVoiceChannel({
        name: data.name,
        communityId: data.communityId,
        description: data.description,
        maxUsers: data.maxUsers,
      });
    }
  }
}

export const apiService = new ApiService();
