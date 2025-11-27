import { Player } from "@minecraft/server";
import { config, barName } from "./data.js";
import { fixNum } from "./lib.js";

export const getWater = (player) => {
  const val = player.getDynamicProperty(config.saveKey);
  return typeof val === "number" ? val : config.full;
};

export const setWater = (player, val) => {
  if (!(player instanceof Player)) return;
  const oldFloor = Math.floor(getWater(player));
  const newVal = fixNum(val);

  player.setDynamicProperty(config.saveKey, newVal);

  const newFloor = Math.floor(newVal);
  if (newFloor !== oldFloor) {
    player.onScreenDisplay.setTitle(`${barName}${newFloor}`);
  }
};

export const showBar = (player) => {
  player.onScreenDisplay.setTitle(`${barName}${Math.floor(getWater(player))}`);
};

export const playBurp = (player) => {
  try {
    player.playSound("random.burp");
  } catch {}
};

export const giveMagic = (player, magic) => {
  if (!magic) return;
  const chance = (magic.chance ?? 100) / 100;
  if (Math.random() <= chance) {
    const ticks = (magic.time ?? 0) * 20;
    player.addEffect(magic.id, ticks, { amplifier: 0, showParticles: false });
  }
};
