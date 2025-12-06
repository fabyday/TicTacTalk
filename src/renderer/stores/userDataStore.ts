import { ServerMeta } from "../../types/server";
import { ShortcutState } from "./shortcutStore";

/**
 * Store meta data and so on
 */
export interface DataStore {
  shortcuts?: ShortcutState;
  server: ServerMeta[];
}
