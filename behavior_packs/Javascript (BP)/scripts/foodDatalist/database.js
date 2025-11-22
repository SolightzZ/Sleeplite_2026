import * as config from "./constants";
const FOOD_MAP = new Map();

export function initializeFoodDatabase() {
  config.FOOD_DATA_LIST.forEach((food) => {
    FOOD_MAP.set(food.id, food);
  });
  console.warn(`[FoodDB] Loaded ${FOOD_MAP.size} food items into O(1) Map.`);
}

export function getFoodData(itemId) {
  return FOOD_MAP.get(itemId) || null;
}
