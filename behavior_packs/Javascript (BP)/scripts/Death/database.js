import { PLAYER_ITEMS } from "./constants.js";

export function getPlayerItem(playerName) {
  return PLAYER_ITEMS[playerName] || null;
}
