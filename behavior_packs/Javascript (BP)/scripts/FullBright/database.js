import { FULL_BRIGHT_TAG, NIGHT_VISION_EFFECT_ID } from "./constants.js";

export function isFullBrightEnabled(player) {
  return player.hasTag(FULL_BRIGHT_TAG);
}

export function disableFullBright(player) {
  if (!player || !isFullBrightEnabled(player)) return;

  player.removeTag(FULL_BRIGHT_TAG);
  const effect = player.getEffect(NIGHT_VISION_EFFECT_ID);
  if (effect) player.removeEffect(NIGHT_VISION_EFFECT_ID);
}

export function setFullBrightState(player, enable) {
  const current = isFullBrightEnabled(player);
  if (enable === current) return undefined;

  if (enable) {
    player.addTag(FULL_BRIGHT_TAG);
    player.addEffect(NIGHT_VISION_EFFECT_ID, 24000, {
      amplifier: 0,
      showParticles: false,
    });
  } else {
    disableFullBright(player);
  }
  return enable;
}
