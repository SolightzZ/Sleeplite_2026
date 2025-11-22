import { world, system } from "@minecraft/server";

import { FullBrightonPlayerLeave } from "./FullBright/system";
import { playerLeaveCamera } from "./Camera/system";
import { magnetPlayerLeaveEvent } from "./magnet/functions.js";
import { clearVisualStateForPlayers } from "./Protection/system.js";
import { clearPlayerFoodDataById } from "./DailyFoodLimit/database.js";

const PLAYER_LEAVE = [FullBrightonPlayerLeave, playerLeaveCamera, magnetPlayerLeaveEvent, clearVisualStateForPlayers, clearPlayerFoodDataById];

export function onPlayerLeave(event) {
  const playerId = event;

  system.run(() => {
    try {
      PLAYER_LEAVE.forEach((actionFn) => {
        actionFn(playerId);
      });
    } catch (error) {
      console.warn(`[PlayerLeave Dispatch] Error during cleanup for Player ID ${playerId}: ${error}`);
    }
  });
}
