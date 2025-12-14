export const setting = {
  range: 12,
  maxPeople: 8,
  maxItem: 32,
  speed: 15,
  canPull: new Set(["minecraft:item", "minecraft:xp_orb"]),

  icon: {
    on: "textures/items/magnet",
    off: "textures/items/magnet2",
    full: "textures/ui/Ping_Offline_Red",
  },

  text: {
    on: "§aMagnet : ON",
    off: "§cMagnet : OFF",
    full: (max) => `§cFull (${max})`,
  },
};
