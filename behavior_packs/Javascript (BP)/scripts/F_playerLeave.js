import { system } from "@minecraft/server";

import { FullBrightonPlayerLeave } from "./FullBright/system";
import { playerLeaveCamera } from "./Camera/system";
import { MagnetonPlayerLeave } from "./magnet/functions.js";
import { clearVisualStateForPlayers } from "./Protection/system.js";
import { DailyFoodplayerLeave } from "./DailyFoodLimit/main.js";

const PLAYER_LEAVE = [FullBrightonPlayerLeave, playerLeaveCamera, MagnetonPlayerLeave, clearVisualStateForPlayers, DailyFoodplayerLeave];

export function onPlayerLeave(event) {
  try {
    const playerId = event;

    system.run(() => {
      try {
        PLAYER_LEAVE.forEach((actionFn) => {
          actionFn(playerId);
        });
      } catch (error) {
        console.warn(`[PlayerLeave] Error during cleanup for Player ID ${playerId}: ${error}`);
      }
    });
  } catch (err) {
    console.error(`[PlayerLeave] Error:`, err);
  }
}
console.warn("[world afterEvents playerLeave] loaded successfully");
