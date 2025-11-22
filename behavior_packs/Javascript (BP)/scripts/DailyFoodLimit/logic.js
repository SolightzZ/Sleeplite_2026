import { Player } from "@minecraft/server";
import { MAX_PER_FOOD } from "./constants.js";
import { getWorldClock, getDayPeriod, hasResetToday, setResetFlag, fmtQuotaReachedMsg, fmtActionBarCount, fmtResetBroadcast } from "./functions.js";
import { getPlayerData, resetFoodData } from "./database.js";

export function beforeUseFood(player, itemTypeId) {
  if (!(player instanceof Player)) return { blocked: false };

  const data = getPlayerData(player.id);
  const count = data.foods[itemTypeId] ?? 0;
  if (count >= MAX_PER_FOOD) {
    return { blocked: true, msg: fmtQuotaReachedMsg(itemTypeId, MAX_PER_FOOD) };
  }
  return { blocked: false };
}

export function afterUseFood(player, itemTypeId) {
  if (!(player instanceof Player)) return { actionBarMsg: undefined };

  const data = getPlayerData(player.id);
  data.foods[itemTypeId] = (data.foods[itemTypeId] ?? 0) + 1;
  const c = data.foods[itemTypeId];
  return { actionBarMsg: fmtActionBarCount(itemTypeId, c, MAX_PER_FOOD) };
}

export function checkAndMaybeResetDay() {
  const { timeOfDay, dayIndex } = getWorldClock();
  const period = getDayPeriod(timeOfDay);

  if (period === "day" && !hasResetToday()) {
    resetFoodData();
    setResetFlag(true);
    return { shouldReset: true, dayIndex, broadcastMsg: fmtResetBroadcast(dayIndex) };
  } else if (period === "night") {
    setResetFlag(false);
  }
  return { shouldReset: false, dayIndex, broadcastMsg: undefined };
}
