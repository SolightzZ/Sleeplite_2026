import { world, system } from "@minecraft/server";

const BOSS_IDS = ["minecraft:ender_dragon", "minecraft:wither", "minecraft:warden"];
const BOSS_TAG = "boss";
const ANIMATION_TICK_DELAY = 5;
const TITLE_DURATION_TICKS = 80;

const formatName = (entityId) => {
  return entityId
    .replace("minecraft:", "")
    .split("_")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
};

const displayBossTitle = (name, subtitle, isDeathEvent) => {
  const players = world.getPlayers();
  if (players.length === 0) return;

  let charIndex = 0;
  const finalSound = isDeathEvent ? "mob.warden.death" : "ambient.weather.thunder";
  const titleOptions = {
    fadeInDuration: 0,
    fadeOutDuration: 50,
    stayDuration: TITLE_DURATION_TICKS,
    subtitle: subtitle,
  };

  function animate() {
    if (charIndex > name.length) return;
    const currentTitle = charIndex === name.length ? (isDeathEvent ? `§c- ${name} -` : `§e- ${name} -`) : name.slice(0, charIndex + 1);

    for (const player of players) {
      player.onScreenDisplay.setTitle(currentTitle, titleOptions);
      player.playSound("mob.wither.shoot");
      if (charIndex === name.length) player.playSound(finalSound);
    }

    charIndex++;
    system.runTimeout(animate, ANIMATION_TICK_DELAY);
  }

  animate();
};

export function itile_main(event) {
  const entity = event.entity;
  if (BOSS_IDS.includes(entity.typeId) && !entity.hasTag(BOSS_TAG)) {
    const bossName = formatName(entity.typeId);
    system.run(() => {
      displayBossTitle(bossName, "Spawn", false);
      entity.addTag(BOSS_TAG);
    });
  }
}

export function boss_main(event) {
  const entity = event.deadEntity;
  if (BOSS_IDS.includes(entity.typeId)) {
    const bossName = formatName(entity.typeId);
    system.run(() => {
      displayBossTitle(bossName, "Death", true);
    });
  }
}
