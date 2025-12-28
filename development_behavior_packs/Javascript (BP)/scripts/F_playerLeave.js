import { system } from "@minecraft/server";

import { FullBrightonPlayerLeave } from "./FullBright/system";
import { playerLeaveCamera } from "./Camera/system";
import { onLeave } from "./magnet/events.js";
import { clearVisualStateForPlayers } from "./Protection/system.js";
import { DailyFoodplayerLeave } from "./DailyFoodLimit/main.js";

const PLAYER_LEAVE = [FullBrightonPlayerLeave, playerLeaveCamera, onLeave, clearVisualStateForPlayers, DailyFoodplayerLeave];

export function onPlayerLeave(event) {
  const playerId = event;
  system.run(() => {
    PLAYER_LEAVE.forEach((actionFn) => {
      actionFn(playerId);
    });
  });
}
console.warn("[world afterEvents playerLeave] loaded successfully");
