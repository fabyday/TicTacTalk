// This is TODO files
export interface Community {
  //TODO
  id: string;
}

export interface CommunityFolder {
  name?: string;
  items: Community[];
}

export type CommunityList = (Community | CommunityFolder)[];
