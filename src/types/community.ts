import { Community } from "../renderer/services/types";

export interface CommunityMeta {
  id: string;
  name: string;
}

export interface CommunityFolderMeta {
  id: string;
  name?: string;
  items: Community[];
}
