import { world, system } from "@minecraft/server";
import { rules } from "./constants.js";
import * as Core from "./core.js";
import * as DayManager from "./day_manager.js";

export function DailyFooditemUse(event) {
  const id = event.source;
  const playerIds = id.typeId;
  const items = event.itemStack;
  if (playerIds === "minecraft:player") {
    Core.tryeat(id, items, event);
  }
}

export function DailyFoodplayerLeave(event) {
  const playerId = event.playerId;
  Core.clean(playerId);
}

world.afterEvents.itemCompleteUse.subscribe((event) => {
  const id = event.source;
  const playerIds = id.typeId;
  const items = event.itemStack;
  if (playerIds === "minecraft:player") {
    Core.ate(id, items);
  }
});

system.runInterval(() => {
  DayManager.checkday();
}, rules.checktime);

console.warn("DailyFood & DayCounter loaded successfully");
