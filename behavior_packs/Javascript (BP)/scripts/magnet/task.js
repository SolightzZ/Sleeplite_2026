import { system } from "@minecraft/server";
import { MagnetTaskIntervalTicks } from "./constants.js";
import { getActiveMagnetUsers } from "./database.js";
import { pullNearbyEntitiesTowardsPlayer } from "./functions.js";

let isMagnetTaskRunning = false;
let magnetTaskHandle = null;

export function startMagnetTaskLoop() {
  if (isMagnetTaskRunning) return;

  isMagnetTaskRunning = true;
  magnetTaskHandle = system.runInterval(() => {
    try {
      const activeUsers = getActiveMagnetUsers();
      if (activeUsers.length === 0) {
        system.clearRun(magnetTaskHandle);
        magnetTaskHandle = null;
        isMagnetTaskRunning = false;
        console.warn("[Magnet] Task stopped: No active players found");
        return;
      }
      for (const user of activeUsers) {
        pullNearbyEntitiesTowardsPlayer(user);
      }
    } catch (error) {
      console.warn(`[Magnet] Task tick error: ${error}`);
    }
  }, MagnetTaskIntervalTicks);
}
