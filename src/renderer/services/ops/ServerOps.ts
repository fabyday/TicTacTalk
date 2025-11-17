import { T3Server } from "../ttapi";
import { PublicCommunity } from "../types/serverDataTypes";
import { T3AbstractOps } from "./abstractOps";

/**
 *
 *
 *
 * this is Operation Wrapper
 */
class T3ServerOps extends T3AbstractOps<T3Server> {
  // createCommunity(communityName: string) {
  //   const result = await server.request("/chat/community", {
  //     method: "POST",
  //     body: JSON.stringify({ name: communityName }),
  //   });
  //   return new T3CommunityFactory(server, result);
  // }

  async getPublicCommunityList() {
    console.log("🔍 공개 커뮤니티 조회 시작");
    try {
      const result = await this.m_server.request("/chat/community/public", {
        method: "GET",
      });
      console.log("✅ succeed, searching for public communities:", result);
      return result;
    } catch (error) {
      console.error("❌ Failed, searching for public communities:", error);
      throw error;
    }
  }
}
