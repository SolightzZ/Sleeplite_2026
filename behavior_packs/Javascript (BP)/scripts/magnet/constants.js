import { GameMode } from "@minecraft/server";
export const SearchRange = 12;
export const MaximumConcurrentUsers = 8;
export const PullLimitPerTick = 32;
export const TaskIntervalTicks = 15;

export const PullableTypeIdSet = new Set(["minecraft:item", "minecraft:xp_orb"]);
export const BlockedGameModes = new Set([GameMode.Creative, GameMode.Spectator]);

export const IconPathEnabled = "textures/items/magnet";
export const IconPathDisabled = "textures/items/magnet2";
export const IconPathFull = "textures/ui/Ping_Offline_Red";

export const TitleEnabled = "§aMagnet : ON";
export const TitleDisabled = "§cMagnet : OFF";
export const TitleFull = (maxUsers) => `§cFull (${maxUsers})`;
