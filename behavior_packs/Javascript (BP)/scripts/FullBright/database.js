import { world } from "@minecraft/server";
import { FULL_BRIGHT_TAG, NIGHT_VISION_EFFECT_ID, EFFECT_DURATION_TICKS, EFFECT_AMPLIFIER_LEVEL, SHOW_PARTICLES } from "./constants.js";

export function isFullBrightEnabled(player) {
  return player.hasTag(FULL_BRIGHT_TAG);
}

function applyEffectTask(player) {
  player.addTag(FULL_BRIGHT_TAG);
  player.addEffect(NIGHT_VISION_EFFECT_ID, EFFECT_DURATION_TICKS, {
    amplifier: EFFECT_AMPLIFIER_LEVEL,
    showParticles: SHOW_PARTICLES,
  });
}

function removeStateTask(player) {
  if (player) {
    player.removeTag(FULL_BRIGHT_TAG);
    const effect = player.getEffect(NIGHT_VISION_EFFECT_ID);
    if (effect) player.removeEffect(NIGHT_VISION_EFFECT_ID);
  }
}

export function disableFullBright(player) {
  if (!player || !isFullBrightEnabled(player)) return;
  removeStateTask(player);
}

export function setFullBrightState(player, enable) {
  const current = isFullBrightEnabled(player);
  if (enable === current) return undefined;

  if (enable) {
    applyEffectTask(player);
  } else {
    removeStateTask(player);
  }
  return enable;
}

export function FullBrightonPlayerLeave(event) {
  const playerId = event.playerId;
  if (typeof playerId !== "string") return;

  try {
    const player = world.getEntity(playerId);
    if (player?.typeId === "minecraft:player") {
      removeStateTask(player);
    }
  } catch (err) {
    console.warn(`[FullBright] Cleanup failed for ${playerId}: ${err}`);
  }
}

export function FullBrightonEntityDeath({ deadEntity: entity }) {
  if (entity?.typeId === "minecraft:player") {
    removeStateTask(entity);
  }
}
