import { CommunityFolderMeta, CommunityMeta } from "./community";

export interface ServerMeta {
  name: string;
  url: string;
  port?: string;
  joinedCommunityLists: (CommunityMeta | CommunityFolderMeta)[];
}
