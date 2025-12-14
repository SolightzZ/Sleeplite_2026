import { showMain } from "./functions.js";

export function startEmote(context) {
  const player = context.source || context.entity;

  if (player && player.typeId === "minecraft:player") {
    showMain(player);
  }
}

console.warn("Emote loaded successfully");
