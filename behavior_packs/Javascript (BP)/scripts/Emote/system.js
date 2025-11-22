import { showMainMenu } from "./functions.js";

export function emote_main({ source: player }) {
  if (player) {
    showMainMenu(player);
  }
}
