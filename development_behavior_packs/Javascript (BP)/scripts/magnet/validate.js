export function canUse(player) {
  try {
    return player && player.isValid && player.location && player.dimension;
  } catch {
    return false;
  }
}
