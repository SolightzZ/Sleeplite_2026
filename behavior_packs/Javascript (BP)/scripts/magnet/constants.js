import { GameMode } from "@minecraft/server";

export const MagnetSearchRange = 12;
export const MagnetMaximumConcurrentUsers = 8;
export const MagnetPullLimitPerTick = 300;
export const MagnetTaskIntervalTicks = 20;

export const MagnetPullableTypeIdSet = Object.freeze(new Set(["minecraft:item", "minecraft:xp_orb"]));

export const MagnetBlockedGameModes = Object.freeze([GameMode.Creative, GameMode.Spectator]);

export const MagnetIconPathEnabled = "textures/items/magnet";
export const MagnetIconPathDisabled = "textures/items/magnet2";
export const MagnetIconPathFull = "textures/ui/Ping_Offline_Red";

export const MagnetTitleEnabled = "§aMagnet : ON";
export const MagnetTitleDisabled = "§cMagnet : OFF";
export const MagnetTitleFull = (maxUsers) => `§cคนเต็ม (${maxUsers})`;
