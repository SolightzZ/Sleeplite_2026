import { ItemStack } from "@minecraft/server";
import { RewardConfiguration, VeryImportantPlayerTag } from "./constants.js";

export function clampNumber(value, minimum, maximum) {
  return Math.min(Math.max(value, minimum), maximum);
}

export function getItemShortNameFromTypeId(fullItemTypeId) {
  return fullItemTypeId.split(":")[1] || fullItemTypeId;
}

export function formatDateAsTextFromDate(dateObj) {
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");
  return `${day}/${month}/${year}`;
}

export function giveItemToPlayerIfSpace(player, itemTypeId, baseCount) {
  try {
    const inventory = player.getComponent("minecraft:inventory")?.container;
    if (!inventory) {
      player.sendMessage("§c[x] ไม่พบคลังเก็บของของผู้เล่น");
      return false;
    }
    if (inventory.emptySlotsCount < 1) {
      player.sendMessage("§c[x] ช่องเก็บของเต็ม!");
      return false;
    }

    const finalCount = player.hasTag(VeryImportantPlayerTag) ? baseCount * RewardConfiguration.VeryImportantPlayerCountMultiplier : baseCount;

    const stack = new ItemStack(itemTypeId, finalCount);
    inventory.addItem(stack);
    return true;
  } catch (error) {
    console.warn(`[Reward] Give item error: ${error}`);
    try {
      player.sendMessage("§c[x] ข้อผิดพลาดขณะมอบไอเท็ม");
    } catch {}
    return false;
  }
}
