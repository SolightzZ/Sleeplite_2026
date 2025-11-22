import { GameMode } from "@minecraft/server";

export const RewardConfiguration = Object.freeze({
  VeryImportantPlayerCountMultiplier: 2,
  TotalRewardDaysInCycle: 7,
  MaximumStoredJsonTextLength: 30000,
});

export const RewardPlanByDay = Object.freeze([
  { DayIndexOneBased: 1, ItemTypeId: "minecraft:apple", ItemCount: 8 },
  { DayIndexOneBased: 2, ItemTypeId: "minecraft:bread", ItemCount: 16 },
  { DayIndexOneBased: 3, ItemTypeId: "minecraft:iron_ingot", ItemCount: 32 },
  { DayIndexOneBased: 4, ItemTypeId: "minecraft:gold_ingot", ItemCount: 32 },
  { DayIndexOneBased: 5, ItemTypeId: "minecraft:diamond", ItemCount: 5 },
  { DayIndexOneBased: 6, ItemTypeId: "minecraft:emerald", ItemCount: 46 },
  { DayIndexOneBased: 7, ItemTypeId: "minecraft:totem_of_undying", ItemCount: 1 },
]);

export const PlayerRewardDynamicPropertyKey = "Data:Reward";
export const AdministratorPlayerTag = "admin";
export const VeryImportantPlayerTag = "VIP";

export const BlockedGameModes = Object.freeze([GameMode.Creative, GameMode.Spectator]);
