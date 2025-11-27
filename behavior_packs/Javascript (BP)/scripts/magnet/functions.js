import { world } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import {
  SearchRange,
  MaximumConcurrentUsers,
  PullLimitPerTick,
  PullableTypeIdSet,
  IconPathEnabled,
  IconPathDisabled,
  IconPathFull,
  TitleEnabled,
  TitleDisabled,
  TitleFull,
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
    if (turnOn && !currentlyActive && activeCount < MaximumConcurrentUsers) {
      MagnetUserStates.set(playerId, { active: true });
      MagnetActiveUserIds.add(playerId);
      player.onScreenDisplay.setActionBar(TitleEnabled);
      player.playSound?.("beacon.power", { volume: 1, pitch: 1.5 });
      startMagnetTaskLoop();
    } else if (!turnOn && currentlyActive) {
      MagnetUserStates.set(playerId, { active: false });
      MagnetActiveUserIds.delete(playerId);
      player.onScreenDisplay.setActionBar(TitleDisabled);
      player.playSound?.("beacon.deactivate", { volume: 1, pitch: 1.5 });
    } else if (turnOn && activeCount >= MaximumConcurrentUsers) {
      player.onScreenDisplay.setActionBar(TitleFull(MaximumConcurrentUsers));
      player.playSound?.("random.anvil_land", { volume: 0.5, pitch: 1.5 });
    }
  } catch (error) {
    console.warn(`[Magnet] Toggle Error: ${error}`);
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

  try {
    const nearbyEntities = playerDimension.getEntities({
      location: { x, y, z },
      maxDistance: SearchRange,
      excludeTypes: ["minecraft:player"],
    });

    for (const entity of nearbyEntities) {
      if (pulledCount >= PullLimitPerTick) break;
      if (!entity.isValid) continue;
      if (!PullableTypeIdSet.has(entity.typeId)) continue;

      entity.teleport(targetLocation, teleportOptions);
      pulledCount++;
      // console.warn(`Pulled Count: ${pulledCount}`);
    }
  } catch (error) {
    console.warn(`[Magnet] Pull Error (ID: ${player.id}): ${error}`);
  }
}

export function showMagnetMenuForPlayer(player) {
  try {
    if (!isPlayerEntityValid(player)) return;

    const activeEntries = [...MagnetUserStates.entries()].filter(([_, data]) => data.active);

    let listText = "§8* No active players";
    if (activeEntries.length > 0) {
      listText = activeEntries
        .map(([id]) => {
          const found = world.getEntity(id);
          return found?.isValid ? `§7» §f${found.name}` : null;
        })
        .filter(Boolean)
        .join("\n");
    }

    const [buttonText, buttonIcon] = getMagnetButtonTextAndIconForPlayer(player, IconPathEnabled, IconPathDisabled, IconPathFull);
    const activeCount = getActiveMagnetUserCount();

    new ActionFormData()
      .title(`Magnet [${activeCount}/${MaximumConcurrentUsers}]`)
      .body(listText)
      .button(buttonText, buttonIcon)
      .show(player)
      .then((result) => {
        if (!result.canceled && result.selection === 0) {
          const willTurnOn = !MagnetUserStates.get(player.id)?.active;
          toggleMagnetForPlayer(player, willTurnOn);
        }
      });
  } catch (error) {
    console.warn(`[Magnet] Menu Error: ${error}`);
  }
}

export function MagnetonScriptEvent({ source }) {
  if (isPlayerEntityValid(source)) showMagnetMenuForPlayer(source);
}

export function MagnetonPlayerLeave(event) {
  removeMagnetUserEverywhere(event.playerId);
}

export function MagnetonEntityDie(event) {
  const dead = event.deadEntity;
  if (dead?.typeId === "minecraft:player") removeMagnetUserEverywhere(dead.id);
}

console.warn("Magnet loaded successfully");
