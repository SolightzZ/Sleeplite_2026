// fooddata.js
// ส่วนนี้มีหน้าที่จัดการข้อมูลและฟังก์ชันสร้าง Lore

// ข้อมูลอาหารทั้งหมด
export const foods = [
  { id: "minecraft:potion", restore: 0, sat: 0, thirst: 4 },
  { id: "minecraft:apple", restore: 4, sat: 2.4, thirst: 1.2 },
  { id: "minecraft:baked_potato", restore: 5, sat: 6, thirst: -1 },
  { id: "minecraft:beetroot", restore: 1, sat: 1.2, thirst: 0.7 },
  { id: "minecraft:beetroot_soup", restore: 6, sat: 7.2, thirst: 2 },
  { id: "minecraft:bread", restore: 5, sat: 6, thirst: -1 },
  { id: "minecraft:cake", restore: 0, sat: 0, thirst: -1 },
  { id: "minecraft:carrot", restore: 3, sat: 3.6, thirst: 0.7 },
  { id: "minecraft:chorus_fruit", restore: 4, sat: 2.4, thirst: 0.7 },
  { id: "minecraft:cooked_chicken", restore: 6, sat: 7.2, thirst: -2 },
  { id: "minecraft:cooked_cod", restore: 5, sat: 6, thirst: -1.6 },
  { id: "minecraft:cooked_mutton", restore: 6, sat: 9.6, thirst: -2.5 },
  { id: "minecraft:cooked_porkchop", restore: 8, sat: 12.8, thirst: -3 },
  { id: "minecraft:cooked_rabbit", restore: 5, sat: 6, thirst: -1.5 },
  { id: "minecraft:cooked_salmon", restore: 6, sat: 9.6, thirst: -1.6 },
  { id: "minecraft:cookie", restore: 2, sat: 0.4, thirst: -0.3 },
  { id: "minecraft:dried_kelp", restore: 1, sat: 0.2, thirst: -0.3 },
  { id: "minecraft:enchanted_golden_apple", restore: 4, sat: 9.6, thirst: 3 },
  { id: "minecraft:glow_berries", restore: 2, sat: 0.4, thirst: 3 },
  { id: "minecraft:golden_apple", restore: 4, sat: 9.6, thirst: 1 },
  { id: "minecraft:golden_carrot", restore: 6, sat: 14.4, thirst: 1.5 },
  { id: "minecraft:honey_bottle", restore: 6, sat: 1.2, thirst: -0.7 },
  { id: "minecraft:melon_slice", restore: 2, sat: 1.2, thirst: -10 },
  { id: "minecraft:mushroom_stew", restore: 6, sat: 7.2, thirst: 2 },
  { id: "minecraft:poisonous_potato", restore: 2, sat: 1.2, thirst: 0.5 },
  { id: "minecraft:potato", restore: 1, sat: 0.6, thirst: 0.5 },
  { id: "minecraft:pufferfish", restore: 1, sat: 0.28, thirst: -0.5 },
  { id: "minecraft:pumpkin_pie", restore: 8, sat: 4.8, thirst: -2 },
  { id: "minecraft:rabbit_stew", restore: 10, sat: 12, thirst: 2 },
  { id: "minecraft:beef", restore: 3, sat: 1.8, thirst: -1.5 },
  { id: "minecraft:chicken", restore: 2, sat: 1.2, thirst: -1 },
  { id: "minecraft:cod", restore: 2, sat: 0.4, thirst: -1 },
  { id: "minecraft:mutton", restore: 2, sat: 1.2, thirst: -1 },
  { id: "minecraft:porkchop", restore: 3, sat: 1.8, thirst: -1.5 },
  { id: "minecraft:rabbit", restore: 3, sat: 1.8, thirst: -1.5 },
  { id: "minecraft:salmon", restore: 2, sat: 0.4, thirst: -0.5 },
  { id: "minecraft:rotten_flesh", restore: 4, sat: 0.86, thirst: -3 },
  { id: "minecraft:spider_eye", restore: 2, sat: 3.22, thirst: -3 },
  { id: "minecraft:cooked_beef", restore: 8, sat: 12.8, thirst: -2 },
  { id: "minecraft:suspicious_stew", restore: 6, sat: 7.2, thirst: 2 },
  { id: "minecraft:sweet_berries", restore: 2, sat: 1.2, thirst: 1 },
  { id: "minecraft:tropical_fish", restore: 1, sat: 0.2, thirst: -0.5 },
  { id: "addon:water_bottle", restore: 0, sat: 0, thirst: 3 },
];

// สีสำหรับ Lore
export const colorRestore = "§r§c"; // แดง
export const colorSat = "§r§6"; // ส้ม
export const colorThirst = "§r§b"; // ฟ้า

// ชื่อ Lore ภาษาไทย
export const loreRestore = "ฟื้นฟู";
export const loreSat = "อิ่ม";
export const loreThirst = "กระหาย";

// ฟังก์ชันสร้าง Lore (Functional: รับ food เป็น input, คืน array เป็น output)
export function makeLore(food) {
  // สร้างเครื่องหมาย +/-
  const thirstSign = food.thirst >= 0 ? "+" : "";

  return [
    `${colorRestore}${loreRestore} +${food.restore}`,
    `${colorSat}${loreSat} +${food.sat}`,
    // ใช้ toFixed(1) เพื่อให้แสดงทศนิยม 1 ตำแหน่ง ถ้าต้องการ
    `${colorThirst}${loreThirst} ${thirstSign}${food.thirst.toFixed(1)}`,
  ];
}

// ฟังก์ชันค้นหาข้อมูลอาหาร (แทน db.getFoodData เดิม)
export function getFoodData(itemId) {
  // ใช้เมธอด .find() ของ Array ซึ่งเป็นแนวคิดแบบ Functional
  // เพื่อค้นหาข้อมูลอาหารแรกที่ตรงกับ itemId
  const foodData = foods.find((food) => food.id === itemId);

  // คืนค่าข้อมูลที่พบ
  return foodData;
}

console.warn("Food data loaded");
