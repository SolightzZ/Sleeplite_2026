import {
  PlayerThirstDynamicPropertyKey,
  ThirstMinimum,
  ThirstMaximum,
  ThirstBarPrefix,
  MovementBaseDrainPerTickByDifficulty,
  SprintingMultiplier,
  JumpingExtraPercent,
  LowThirstExtraPercent,
} from "./constants.js";
import { Player } from "@minecraft/server";

export function clampNumber(value, minimum, maximum) {
  return Math.min(Math.max(value, minimum), maximum);
}

export function getPlayerThirstOrDefault(player) {
  const raw = player.getDynamicProperty(PlayerThirstDynamicPropertyKey);
  return typeof raw === "number" ? raw : ThirstMaximum;
}

export function setPlayerThirstAndUpdateTitle(player, value) {
  if (!(player instanceof Player)) return;
  const previousFloor = Math.floor(getPlayerThirstOrDefault(player));
  const clamped = clampNumber(value, ThirstMinimum, ThirstMaximum);
  player.setDynamicProperty(PlayerThirstDynamicPropertyKey, clamped);
  const currentFloor = Math.floor(clamped);
  if (currentFloor !== previousFloor) {
    player.onScreenDisplay.setTitle(`${ThirstBarPrefix}${currentFloor}`);
  }
}

export function showPlayerThirstTitleNow(player) {
  player.onScreenDisplay.setTitle(`${ThirstBarPrefix}${Math.floor(getPlayerThirstOrDefault(player))}`);
}

export function isPlayerMovingByInputVector(player) {
  const vector = player.inputInfo?.getMovementVector?.();
  return !!vector && (vector.x !== 0 || vector.z !== 0);
}

export function computeMovementThirstDrainPerTick(player, isMoving, difficultyKey) {
  if (!isMoving) return 0;
  const base = MovementBaseDrainPerTickByDifficulty[difficultyKey] ?? MovementBaseDrainPerTickByDifficulty.normal;
  const sprintFactor = player.isSprinting ? SprintingMultiplier : 1;
  const jumpFactor = player.inputInfo?.isJumping ? 1 + JumpingExtraPercent : 1;
  const lowThirstFactor = getPlayerThirstOrDefault(player) < 18 ? 1 + LowThirstExtraPercent : 1;
  return base * sprintFactor * jumpFactor * lowThirstFactor;
}

export function regenerateHealthAndReturnThirstCost(player, difficultyKey) {
  const health = player.getComponent("health");
  if (!health) return 0;

  const missing = health.effectiveMax - health.currentValue;
  const canRegen = missing >= 1 && missing !== health.effectiveMax && getPlayerThirstOrDefault(player) > 16;
  if (!canRegen) return 0;

  health.setCurrentValue(health.currentValue + missing / (health.effectiveMax + missing));

  if (difficultyKey === "easy") return 0.075;
  if (difficultyKey === "hard") return 0.125;
  return 0.1;
}
