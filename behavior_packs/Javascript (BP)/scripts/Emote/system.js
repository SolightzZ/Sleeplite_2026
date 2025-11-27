import { showMainMenu } from "./functions";

export function emote_main(context) {
  const player = context.source || context.entity;

  if (player && player.typeId === "minecraft:player") {
    showMainMenu(player);
  }
}

console.warn("Emote loaded successfully");
