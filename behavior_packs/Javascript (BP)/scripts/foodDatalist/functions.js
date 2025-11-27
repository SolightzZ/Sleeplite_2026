import { EntityComponentTypes, Player } from "@minecraft/server";
import * as db from "./database";
import * as config from "./constants";

function createLoreArray(foodData) {
  const thirstSign = foodData.thirst >= 0 ? "+" : "";
  return [
    `${config.COLOR_RESTORATION}${config.LORE_RESTORATION} +${foodData.restoration}`,
    `${config.COLOR_SATURATION}${config.LORE_SATURATION} +${foodData.saturation}`,
    `${config.COLOR_THIRST}${config.LORE_THIRST} ${thirstSign}${foodData.thirst}`,
  ];
}

export function updateFoodLore(player) {
  try {
    const inventoryComponent = player.getComponent(EntityComponentTypes.Inventory);
    if (!inventoryComponent) {
      player.sendMessage(`§c[x] Failed to access inventory`);
      return;
    }
    const inventory = inventoryComponent.container;

    for (let slot = 0; slot < inventory.size; slot++) {
      const item = inventory.getItem(slot);
      if (!item) continue;

      const foodData = db.getFoodData(item.typeId);
      if (!foodData) continue;

      const newLore = createLoreArray(foodData);

      item.setLore(newLore);
      inventory.setItem(slot, item);
    }
  } catch (error) {
    player.sendMessage(`§c[x] Failed to update item lore`);
    console.warn(`Error updating Lore for ${player.name}: ${error}`);
  }
}

console.warn("Food Data list loaded successfully");
