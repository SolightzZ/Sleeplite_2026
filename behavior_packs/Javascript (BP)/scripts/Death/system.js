import { system, world, ItemStack, Player } from "@minecraft/server";
import { SCOREBOARD_DEATHS, SCOREBOARD_DEATHS_PLUS } from "./constants.js";
import { formatDimensionId, floorPosition } from "./functions.js";
import { getPlayerItem } from "./database.js";

function getOrCreateObjective(id) {
  let obj = world.scoreboard.getObjective(id);
  if (!obj) {
    try {
      obj = world.scoreboard.addObjective(id);
    } catch (err) {
      console.warn(`[Scoreboard] Cannot create '${id}': ${err}`);
    }
  }
  return obj;
}

function addDeathScore(player) {
  const identity = player.scoreboardIdentity;
  if (!identity) return;

  try {
    const objPlus = getOrCreateObjective(SCOREBOARD_DEATHS_PLUS);
    const objNormal = getOrCreateObjective(SCOREBOARD_DEATHS);
    objPlus?.addScore(identity, 1);
    objNormal?.addScore(identity, 1);
  } catch (err) {
    console.warn("[DeathScore] Failed:" + err);
  }
}

function dropDeathItem(player, damageSource) {
  const name = player.name;
  const loc = floorPosition(player.location ?? { x: 0, y: 0, z: 0 });
  const dimension = formatDimensionId(player.dimension?.id ?? "minecraft:overworld");
  player.sendMessage(`§7[/] ${name} died at ${loc.x} ${loc.y} ${loc.z} in ${dimension}`);

  const itemId = getPlayerItem(name);
  if (!itemId) return;

  try {
    const killerEntity = damageSource?.damagingEntity;
    const killerName = killerEntity
      ? killerEntity.typeId === "minecraft:player"
        ? killerEntity.name ?? "Unknown Player"
        : killerEntity.typeId.replace("minecraft:", "")
      : damageSource?.cause ?? "Unknown";

    const item = new ItemStack(itemId, 1);
    item.setLore([`§r§8Killer: §9${killerName}`, `§8Location: §9${loc.x} ${loc.y} ${loc.z}`, `§8Dimension: §9${dimension}`]);

    const spawnLoc = damageSource?.cause === "void" ? { x: loc.x, y: -55, z: loc.z } : loc;
    player.dimension.spawnItem(item, spawnLoc);
  } catch (err) {
    console.warn(`[DropItem] Failed for ${name}: ${err}`);
  }
}

export function handlePlayerDeath({ deadEntity, damageSource }) {
  if (!(deadEntity instanceof Player)) return;
  system.run(() => {
    dropDeathItem(deadEntity, damageSource);
    addDeathScore(deadEntity);
  });
}

system.run(() => {
  getOrCreateObjective(SCOREBOARD_DEATHS);
  getOrCreateObjective(SCOREBOARD_DEATHS_PLUS);
});

console.warn("Death loaded successfully");
