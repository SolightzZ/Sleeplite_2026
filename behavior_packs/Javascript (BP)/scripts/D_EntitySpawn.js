import { system } from "@minecraft/server";
import { itile_main } from "./Others/title";
import { checkBanOnSpawn } from "./ban/system";
import { onPlayerFirstSpawnOrJoin } from "./thirst/logic.js";

const SPAWN_ACTIONS = {
  "minecraft:ender_dragon": [itile_main],
  "minecraft:wither": [itile_main],
  "minecraft:warden": [itile_main],
  "minecraft:player": [checkBanOnSpawn, onPlayerFirstSpawnOrJoin],
};

export function onEntitySpawn(event) {
  const entity = event.entity;

  if (!entity) return;
  if (!entity.typeId) return;

  const actions = SPAWN_ACTIONS[entity.typeId];
  if (!actions) return;
  if (actions.length === 0) return;

  system.run(() => {
    try {
      for (const action of actions) {
        if (typeof action === "function") {
          action(event);
        }
      }
    } catch (error) {
      console.warn(`[EntitySpawn Dispatch] Error running logic for ${entity.typeId}: ${error}`);
    }
  });
}
