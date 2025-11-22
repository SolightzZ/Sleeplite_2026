export const Colors = { gold: "§6", white: "§f", gray: "§7", red: "§c" };

export const AnimationFrames = ["--", "-- --", "-- D --", "-- DAY --"];
export const getDayText = (day) => `-- DAY ${day} --`;

export const MAX_PER_FOOD = 8;

export const DP = {
  RESET_FLAG: "food:reset:v1",
  FEATURE_ANIM: "food:feature:anim",
  FEATURE_BROADCAST: "food:feature:broadcast",
};

export const CHECK_INTERVAL = 512;
export const MAX_UI_OPS_PER_TICK = 200;
export const BROADCAST_MIN_GAP_TICKS = 30;
export const METRICS_FLUSH_EVERY_TICKS = 2400;

export const FOOD_LIST = [
  "minecraft:apple",
  "minecraft:bread",
  "minecraft:cooked_beef",
  "minecraft:cooked_chicken",
  "minecraft:cooked_porkchop",
  "minecraft:potion",
  "minecraft:water_bottle",
  "minecraft:milk_bucket",
  "minecraft:baked_potato",
  "minecraft:beetroot",
  "minecraft:beetroot_soup",
  "minecraft:cake",
  "minecraft:carrot",
  "minecraft:chorus_fruit",
  "minecraft:cooked_cod",
  "minecraft:cooked_mutton",
  "minecraft:cooked_rabbit",
  "minecraft:cooked_salmon",
  "minecraft:cookie",
  "minecraft:dried_kelp",
  "minecraft:enchanted_golden_apple",
  "minecraft:golden_apple",
  "minecraft:glow_berries",
  "minecraft:golden_carrot",
  "minecraft:honey_bottle",
  "minecraft:melon_slice",
  "minecraft:mushroom_stew",
  "minecraft:poisonous_potato",
  "minecraft:potato",
  "minecraft:pufferfish",
  "minecraft:pumpkin_pie",
  "minecraft:rabbit_stew",
  "minecraft:beef",
  "minecraft:chicken",
  "minecraft:cod",
  "minecraft:mutton",
  "minecraft:porkchop",
  "minecraft:rabbit",
  "minecraft:salmon",
  "minecraft:rotten_flesh",
  "minecraft:spider_eye",
  "minecraft:suspicious_stew",
  "minecraft:sweet_berries",
  "minecraft:tropical_fish",
  "addon:dunlin_donuts",
  "addon:kfc",
  "addon:m1",
  "addon:m2",
  "addon:m3",
  "addon:McDonald",
  "addon:su1",
  "addon:su2",
  "addon:the_coffee_bean",
  "addon:cooked_axolotl_bucket",
  "addon:co",
  "addon:sp_1",
  "addon:sp_2",
  "addon:sp_3",
  "addon:sp_4",
];

export const FOOD_SET = new Set(FOOD_LIST);
export const FOOD_DISPLAY_NAME = (() => {
  const m = new Map();
  for (const id of FOOD_LIST) {
    const raw = id.split(":").pop() ?? id;
    m.set(id, raw.charAt(0).toUpperCase() + raw.slice(1));
  }
  return m;
})();
