import { onDieDeaths } from "./Death/main.js";
import { gravestone_main } from "./Others/gravestones.js";
import { FullBrightonEntityDeath } from "./FullBright/system.js";
import { boss_main } from "./Others/title.js";
import { onDie } from "./magnet/events.js";

const PLAYER_ACTIONS = [onDieDeaths, onDie, FullBrightonEntityDeath, gravestone_main];

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
      fn(event);
    }
  }
}
console.warn("[world afterEvents entityDie] loaded successfully");
