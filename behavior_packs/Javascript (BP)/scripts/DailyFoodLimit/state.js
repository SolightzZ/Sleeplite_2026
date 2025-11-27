const nameCache = new Map();
const playerData = new Map();
const spamCooldown = new Map();
let lastDay = -1;

export const getCachedName = (typeId) => nameCache.get(typeId);
export const setCachedName = (typeId, name) => nameCache.set(typeId, name);

export const getPlayerCount = (playerId, itemType) => {
  const data = playerData.get(playerId) || {};
  return data[itemType] || 0;
};

export const incrementPlayerCount = (playerId, itemType) => {
  const data = playerData.get(playerId) || {};
  const current = data[itemType] || 0;
  data[itemType] = current + 1;
  playerData.set(playerId, data);
  return data[itemType];
};

export const clearPlayerData = (playerId) => {
  playerData.delete(playerId);
  spamCooldown.delete(playerId);
};

export const resetAllDailyData = () => {
  playerData.clear();
  spamCooldown.clear();
};

export const getSpamTime = (playerId) => spamCooldown.get(playerId) || 0;
export const setSpamTime = (playerId, tick) => spamCooldown.set(playerId, tick);

export const getLastDay = () => lastDay;
export const setLastDay = (day) => {
  lastDay = day;
};
