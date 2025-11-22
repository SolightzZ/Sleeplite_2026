import { GameMode } from "@minecraft/server";

export const ColorCode = Object.freeze({
  Purple: "§d",
  Magenta: "§m",
  Cyan: "§z",
  Teal: "§t",
  Blue: "§b",
  Reset: "§r",
  White: "§f",
});

export const ThirstBarPrefix =
  `${ColorCode.Purple}${ColorCode.Magenta}${ColorCode.Cyan}` +
  `${ColorCode.Teal}${ColorCode.Blue}${ColorCode.Reset}${ColorCode.Reset}${ColorCode.White}`;

export const PlayerThirstDynamicPropertyKey = "thirst.current";
export const EntityLastDrinkTimeDynamicPropertyKey = "drink.cooldown.millis";

export const ThirstMinimum = 0;
export const ThirstMaximum = 21;

export const BlockedGameModes = Object.freeze([GameMode.Creative, GameMode.Spectator]);

export const ShowEffectEveryNTicks = 6;
export const RefreshTitleEveryNTicks = 20;
export const MainLoopIntervalTicks = 20;

export const MovementBaseDrainPerTickByDifficulty = Object.freeze({
  easy: 0.00526,
  normal: 0.00625,
  hard: 0.00714,
});
export const SprintingMultiplier = 1.76;
export const JumpingExtraPercent = 0.2;
export const LowThirstExtraPercent = 0.1;
export const DrinkFromEntityCooldownSeconds = 7;
