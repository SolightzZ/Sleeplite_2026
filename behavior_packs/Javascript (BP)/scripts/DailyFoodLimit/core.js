import { system } from "@minecraft/server";
import { CONFIG, FOOD_SET } from "./config.js";
import * as State from "./state.js";
import * as Utils from "./utils.js";
import * as UI from "./ui.js";

const resolveName = (typeId) => {
  let name = State.getCachedName(typeId);
  if (!name) {
    name = Utils.formatItemName(typeId);
    State.setCachedName(typeId, name);
  }
  return name;
};

export const processFoodLimit = (player, itemStack, event) => {
  const typeId = itemStack?.typeId;
  if (!Utils.isFoodRestricted(FOOD_SET, typeId)) return;

  const count = State.getPlayerCount(player.id, typeId);

  if (count >= CONFIG.maxFoodPerDay) {
    event.cancel = true;

    const currentTick = system.currentTick;
    if (currentTick - State.getSpamTime(player.id) < CONFIG.spamCooldownTick) return;

    State.setSpamTime(player.id, currentTick);
    UI.showLimitWarning(player, resolveName(typeId), CONFIG.maxFoodPerDay);
  }
};

export const processFoodConsumption = (player, itemStack) => {
  if (!itemStack) return;
  const typeId = itemStack.typeId;

  if (!Utils.isFoodRestricted(FOOD_SET, typeId)) return;

  const newCount = State.incrementPlayerCount(player.id, typeId);
  UI.showSuccessMessage(player, resolveName(typeId), newCount, CONFIG.maxFoodPerDay);
};

export const checkDayCycle = () => {
  const currentDay = Utils.getCurrentDay();

  if (currentDay > State.getLastDay()) {
    State.resetAllDailyData();

    const lastDay = State.getLastDay();
    if (CONFIG.enableAnimation && lastDay !== -1) {
      UI.playNewDayAnimation(currentDay);
    }

    State.setLastDay(currentDay);
  }
};

export const cleanupPlayer = (playerId) => {
  State.clearPlayerData(playerId);
};
