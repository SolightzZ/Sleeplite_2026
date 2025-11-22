import { world } from "@minecraft/server";
import { MagnetBlockedGameModes, MagnetMaximumConcurrentUsers } from "./constants.js";

export const MagnetUserStates = new Map();
export const MagnetActiveUserIds = new Set();
export const MagnetActivePlayerCache = new Map();
export const isPlayerEntityValid = (player) => !!(player && player.isValid && player.id && player.dimension && player.location);

export function removeMagnetUserEverywhere(playerId) {
  const removedState = MagnetUserStates.delete(playerId);
  const removedCache = MagnetActivePlayerCache.delete(playerId);
  const removedActive = MagnetActiveUserIds.delete(playerId);
  if (removedState || removedCache || removedActive) {
    console.warn(`[Magnet] Removed player state: ${playerId}`);
  }
}

export function getActiveMagnetUserCount() {
  return MagnetActiveUserIds.size;
}

export function getActiveMagnetUsers() {
  const players = [];
  for (const id of MagnetActiveUserIds) {
    let player = MagnetActivePlayerCache.get(id);
    if (!player || !player.isValid) {
      player = world.getEntity(id);
      if (player?.isValid) {
        if (!MagnetBlockedGameModes.includes(player.getGameMode())) {
          MagnetActivePlayerCache.set(id, player);
          players.push(player);
        } else {
          removeMagnetUserEverywhere(id);
        }
      } else {
        removeMagnetUserEverywhere(id);
      }
    } else {
      players.push(player);
    }
  }
  return players;
}

export function getMagnetButtonTextAndIconForPlayer(player, iconOn, iconOff, iconFull) {
  const data = MagnetUserStates.get(player.id);
  const activeCount = getActiveMagnetUserCount();

  if (data?.active) return ["Magnet: §aON", iconOn];
  if (activeCount < MagnetMaximumConcurrentUsers) return ["Magnet: §cOFF", iconOff];
  return [`§cคนเต็ม (${MagnetMaximumConcurrentUsers})`, iconFull];
}
