export const playerFoodData = new Map();

export function getPlayerData(playerId) {
  let d = playerFoodData.get(playerId);
  if (!d) {
    d = { foods: Object.create(null) };
    playerFoodData.set(playerId, d);
  }
  return d;
}

export function resetFoodData() {
  playerFoodData.clear();
}

export function clearPlayerFoodDataById(playerId) {
  if (!playerId) return false;
  return playerFoodData.delete(playerId);
}
