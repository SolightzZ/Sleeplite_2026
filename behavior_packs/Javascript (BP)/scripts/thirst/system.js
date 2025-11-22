import { world, system } from "@minecraft/server";
import { MainLoopIntervalTicks } from "./constants.js";
import {
  onItemCompleteUse,
  onInteractWithCauldron,
  onInteractWithEntityToDrink,
  onInteractWithWaterSurface,
  onScriptEventReceive,
  mainThirstTickLoop,
} from "./logic.js";

export function startThirstSystem() {
  world.afterEvents.itemCompleteUse.subscribe(onItemCompleteUse);

  world.afterEvents.playerInteractWithBlock.subscribe(onInteractWithCauldron);
  world.beforeEvents.playerInteractWithEntity.subscribe(onInteractWithEntityToDrink);
  world.beforeEvents.playerInteractWithBlock.subscribe(onInteractWithWaterSurface);

  system.afterEvents.scriptEventReceive.subscribe(onScriptEventReceive, { namespaces: ["thirst"] });

  system.runInterval(mainThirstTickLoop, MainLoopIntervalTicks);
}
