import { handlePlayerDeath } from "./Death/system.js";
import { gravestone_main } from "./Others/gravestones.js";
import { FullBrightonEntityDeath } from "./FullBright/system.js";
import { boss_main } from "./Others/title.js";
import { magnetEntityDieEvent } from "./magnet/functions.js";
import { onPlayerDeathResetThirst } from "./thirst/logic.js";

const PLAYER_ACTIONS = [handlePlayerDeath, magnetEntityDieEvent, FullBrightonEntityDeath, gravestone_main, , onPlayerDeathResetThirst];

const DEATH_ACTIONS = {
  "minecraft:player": PLAYER_ACTIONS,
  "minecraft:ender_dragon": boss_main,
  "minecraft:wither": boss_main,
  "minecraft:warden": boss_main,
};

export function onEntityDeath(event) {
  const entity = event.deadEntity;
  if (!entity) return;

  const actions = DEATH_ACTIONS[entity.typeId];
  if (!actions) return;

  if (Array.isArray(actions)) {
    for (let i = 0; i < actions.length; i++) {
      const fn = actions[i];
      if (!fn) continue;
      try {
        fn(event);
      } catch (err) {
        console.error(`[DeathSystem] Error in ${fn.name || "unknown"}:`, err);
      }
    }
  } else {
    try {
      actions(event);
    } catch (err) {
      console.error(`[DeathSystem] Error in ${actions.name || "unknown"}:`, err);
    }
  }
}
