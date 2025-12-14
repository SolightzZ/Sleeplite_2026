import { world } from "@minecraft/server";
import { BAN_DATA_PROPERTY_KEY } from "./constants.js";

let banPlayerCache = new Map();

function getBannedPlayersData() {
  if (banPlayerCache.size > 0) return banPlayerCache;
  const rawData = world.getDynamicProperty(BAN_DATA_PROPERTY_KEY);
  if (typeof rawData === "string") {
    banPlayerCache = new Map(Object.entries(JSON.parse(rawData)));
  }
  return banPlayerCache;
}

function saveBannedPlayersData(banData) {
  world.setDynamicProperty(BAN_DATA_PROPERTY_KEY, JSON.stringify(Object.fromEntries(banData)));
}

export { getBannedPlayersData, saveBannedPlayersData };
