import { world } from "@minecraft/server";
import { BlockedGameModes, MaximumConcurrentUsers } from "./constants.js";

export const MagnetUserStates = new Map();
export const MagnetActiveUserIds = new Set();
export const MagnetActivePlayerCache = new Map();

export const isPlayerEntityValid = (player) => !!(player && player.isValid && player.id && player.dimension && player.location);

export function removeMagnetUserEverywhere(playerId) {
  const removedState = MagnetUserStates.delete(playerId);
  const removedCache = MagnetActivePlayerCache.delete(playerId);
  const removedActive = MagnetActiveUserIds.delete(playerId);

  if (removedState) console.warn(`[Magnet] MagnetUserStates Cleaned up: ${playerId}`);
  if (removedCache) console.warn(`[Magnet] MagnetActivePlayerCache Cleaned up: ${playerId}`);
  if (removedActive) console.warn(`[Magnet] MagnetActiveUserIds Cleaned up: ${playerId}`);
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

      if (player && player.isValid) {
        if (!BlockedGameModes.has(player.getGameMode())) {
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
  if (activeCount < MaximumConcurrentUsers) return ["Magnet: §cOFF", iconOff];
  return [`§cFull (${MaximumConcurrentUsers})`, iconFull];
}
