import { world, system } from "@minecraft/server";
import { config } from "./data.js";
import { events } from "./events.js";

export function startGame() {
  world.afterEvents.playerSpawn.subscribe(events.join);
  world.afterEvents.entityDie.subscribe(events.die);
  world.afterEvents.itemCompleteUse.subscribe(events.eat);
  world.afterEvents.playerInteractWithBlock.subscribe(events.drinkPot);
  world.beforeEvents.playerInteractWithEntity.subscribe(events.drinkCow);
  world.beforeEvents.playerInteractWithBlock.subscribe(events.drinkFloor);

  system.runInterval(events.loop, config.loopTime);
}

console.warn("[Thirst] loaded successfully");
