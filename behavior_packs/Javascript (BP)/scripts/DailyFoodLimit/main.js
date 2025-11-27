import { world, system, Player } from "@minecraft/server";
import { CONFIG } from "./config.js";
import * as Core from "./core.js";

world.beforeEvents.itemUse.subscribe((event) => {
  if (event.source instanceof Player) {
    Core.processFoodLimit(event.source, event.itemStack, event);
  }
});

world.afterEvents.itemCompleteUse.subscribe((event) => {
  if (event.source instanceof Player) {
    Core.processFoodConsumption(event.source, event.itemStack);
  }
});

world.afterEvents.playerLeave.subscribe((event) => {
  Core.cleanupPlayer(event.playerId);
});

system.runInterval(() => {
  Core.checkDayCycle();
}, CONFIG.dayCheckInterval);

console.warn("Daily FoodLimit loaded successfully");
console.warn("Day Counter loaded successfully");
