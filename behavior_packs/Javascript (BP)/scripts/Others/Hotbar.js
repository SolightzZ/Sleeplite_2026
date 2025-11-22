import { world } from "@minecraft/server";

const SOUND_VOLUME = 0.08;
const SOUND_PITCH = 1.8;

function playHotbarSound(player) {
  player.playSound("note.hat", {
    volume: SOUND_VOLUME,
    pitch: SOUND_PITCH,
  });
}

world.afterEvents.playerHotbarSelectedSlotChange.subscribe((event) => {
  const player = event.player;

  if (!player) return;
  playHotbarSound(player);
});
