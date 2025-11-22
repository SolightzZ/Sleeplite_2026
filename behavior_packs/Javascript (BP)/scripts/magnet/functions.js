import { world } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import {
  MagnetSearchRange,
  MagnetMaximumConcurrentUsers,
  MagnetPullLimitPerTick,
  MagnetPullableTypeIdSet,
  MagnetIconPathEnabled,
  MagnetIconPathDisabled,
  MagnetIconPathFull,
  MagnetTitleEnabled,
  MagnetTitleDisabled,
  MagnetTitleFull,
} from "./constants.js";
import {
  MagnetUserStates,
  MagnetActiveUserIds,
  isPlayerEntityValid,
  getActiveMagnetUserCount,
  getMagnetButtonTextAndIconForPlayer,
  removeMagnetUserEverywhere,
} from "./database.js";
import { startMagnetTaskLoop } from "./task.js";

export function toggleMagnetForPlayer(player, turnOn) {
  if (!isPlayerEntityValid(player)) return;

  const playerId = player.id;
  const currentlyActive = MagnetUserStates.get(playerId)?.active === true;
  const activeCount = getActiveMagnetUserCount();

  try {
    if (turnOn && !currentlyActive && activeCount < MagnetMaximumConcurrentUsers) {
      MagnetUserStates.set(playerId, { active: true });
      MagnetActiveUserIds.add(playerId);
      player.onScreenDisplay.setActionBar(MagnetTitleEnabled);
      try {
        player.playSound?.("beacon.power", { volume: 1, pitch: 1.5 });
      } catch {}
      startMagnetTaskLoop();
    } else if (!turnOn && currentlyActive) {
      MagnetUserStates.set(playerId, { active: false });
      MagnetActiveUserIds.delete(playerId);
      player.onScreenDisplay.setActionBar(MagnetTitleDisabled);
      try {
        player.playSound?.("beacon.deactivate", { volume: 1, pitch: 1.5 });
      } catch {}
    } else if (turnOn && activeCount >= MagnetMaximumConcurrentUsers) {
      player.onScreenDisplay.setActionBar(MagnetTitleFull(MagnetMaximumConcurrentUsers));
      try {
        player.playSound?.("random.anvil_land", { volume: 1, pitch: 1.5 });
      } catch {}
    }
  } catch (error) {
    console.warn(`[Magnet] Toggle failed: ${error}`);
    removeMagnetUserEverywhere(playerId);
  }
}

export function pullNearbyEntitiesTowardsPlayer(player) {
  if (!isPlayerEntityValid(player)) return;

  const { x, y, z } = player.location;
  const playerDimension = player.dimension;
  const rotation = player.getRotation?.() ?? { x: 0, y: 0 };

  const targetLocation = { x, y: y + 0.5, z };
  const teleportOptions = { dimension: playerDimension, rotation };

  let pulledCount = 0;

  ว;
  try {
    const nearbyEntities = playerDimension.getEntities({
      location: { x, y, z },
      maxDistance: MagnetSearchRange,
      excludeTypes: ["minecraft:player"],
    });

    for (const entity of nearbyEntities) {
      if (pulledCount >= MagnetPullLimitPerTick) break;
      if (!MagnetPullableTypeIdSet.has(entity.typeId)) continue;

      try {
        entity.teleport(targetLocation, teleportOptions);
        pulledCount++;
      } catch {}
    }
  } catch (error) {
    console.warn(`[Magnet] Item attraction failed (Player ID: ${player.id}): ${error}`);
  }
}

export function showMagnetMenuForPlayer(player) {
  if (!isPlayerEntityValid(player)) return;

  try {
    const allEntries = [...MagnetUserStates.entries()];
    const activeNames = allEntries
      .filter(([_, data]) => data.active)
      .map(([id]) => {
        const found = world.getEntity(id);
        return found?.isValid ? `§7§l»§r §f${found.name}` : null;
      })
      .filter(Boolean)
      .join("\n");

    const listText = activeNames || "§8* ไม่มีใครเปิดอยู่";
    const [buttonText, buttonIcon] = getMagnetButtonTextAndIconForPlayer(player, MagnetIconPathEnabled, MagnetIconPathDisabled, MagnetIconPathFull);
    const activeCount = getActiveMagnetUserCount();

    new ActionFormData()
      .title(`แม่เหล็ก [ผู้เล่น: ${activeCount}/${MagnetMaximumConcurrentUsers}]`)
      .body(listText)
      .button(buttonText, buttonIcon)
      .show(player)
      .then((result) => {
        if (!result.canceled && result.selection === 0) {
          const willTurnOn = !MagnetUserStates.get(player.id)?.active;
          toggleMagnetForPlayer(player, willTurnOn);
        }
      })
      .catch((error) => console.warn(`[Magnet] Menu error (Player: ${player.id}): ${error}`));
  } catch (error) {
    console.warn(`[Magnet] Failed to display menu (Player: ${player.id}): ${error}`);
  }
}

export function openMagnetMenuScriptEvent({ source }) {
  if (isPlayerEntityValid(source)) showMagnetMenuForPlayer(source);
}
export function magnetPlayerLeaveEvent(event) {
  removeMagnetUserEverywhere(event.playerId);
  console.warn(`Removed magnet data for Player ID ${event.playerId}`);
}
export function magnetEntityDieEvent(event) {
  const dead = event.deadEntity;
  if (dead?.typeId === "minecraft:player") removeMagnetUserEverywhere(dead.id);
}
