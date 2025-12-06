import { world } from "@minecraft/server";

world.afterEvents.playerHotbarSelectedSlotChange.subscribe((event) => {
  if (event.player) {
    event.player.playSound("note.hat", {
      volume: 0.08,
      pitch: 1.8,
    });
  }
});

console.warn("playHotbarSound loaded successfully");
