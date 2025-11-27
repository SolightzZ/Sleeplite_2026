import { world } from "@minecraft/server";

function playHotbarSound(player) {
  const SVOLUME = 0.08;
  const SOUND_PITCH = 1.8;
  const NAMES = "note.hat";

  player.playSound(NAMES, {
    volume: SVOLUME,
    pitch: SOUND_PITCH,
  });
}

world.afterEvents.playerHotbarSelectedSlotChange.subscribe((event) => {
  const player = event.player;
  if (!player) return;
  playHotbarSound(player);
});

console.warn("playHotbarSound loaded successfully");
