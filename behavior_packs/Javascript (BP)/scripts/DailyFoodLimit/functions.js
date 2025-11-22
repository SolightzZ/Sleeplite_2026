import { world } from "@minecraft/server";
import { Colors, FOOD_DISPLAY_NAME, DP } from "./constants.js";

export function getWorldClock() {
  const total = Number(world.getDay?.() ?? 0);
  const timeOfDay = total % 24000;
  const dayIndex = Math.floor(total / 24000) + 1;
  return { total, timeOfDay, dayIndex };
}

export function getDayPeriod(timeOfDay) {
  return timeOfDay >= 12541 && timeOfDay < 23250 ? "night" : "day";
}

export function getDisplayName(foodType) {
  return FOOD_DISPLAY_NAME.get(foodType) ?? foodType;
}

export function hasResetToday() {
  return world.getDynamicProperty(DP.RESET_FLAG) === true;
}

export function setResetFlag(v) {
  world.setDynamicProperty(DP.RESET_FLAG, v === true);
}

export function isFeatureEnabled(dpKey, fallbackTrue = true) {
  const val = world.getDynamicProperty(dpKey);
  return typeof val === "boolean" ? val : fallbackTrue;
}

export function fmtQuotaReachedMsg(foodType, maxPerFood) {
  return `${Colors.red}คุณได้กิน ${getDisplayName(foodType)} ครบ ${maxPerFood} ครั้งแล้ว!`;
}

export function fmtActionBarCount(foodType, count, maxPerFood) {
  return `+ ${getDisplayName(foodType)} (${count}/${maxPerFood}§r)`;
}

export function fmtResetBroadcast(dayIndex) {
  return `${Colors.gold}[FoodData]${Colors.white} ถูกรีเซ็ตแล้ว! ${Colors.gray}(Day: ${dayIndex})`;
}
