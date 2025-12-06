import { Player } from "@minecraft/server";

import { showCameraMenu } from "./Camera/system.js";
import { emote_main } from "./Emote/system.js";
import { FullBrightItemUse } from "./FullBright/system.js";
import { MagnetonScriptEvent } from "./magnet/functions.js";
import { mainBanSystem } from "./ban/system.js";
import { RewarditemUse } from "./Reward/system.js";
import { setting_main } from "./Others/setting.js";
import { bankingSystem } from "./economy/system.js";
import { ZoneProtection_OnItemUse } from "./Protection/system.js";
import { LligitemUse } from "./light/system.js";
import { DailyFooditemUse } from "./DailyFoodLimit/main.js";
import { foods } from "./DailyFoodLimit/constants.js";

const ITEM_ACTIONS = {
  "addon:protection": ZoneProtection_OnItemUse,
  "minecraft:light_block_13": LligitemUse,
  "addon:magnet_": MagnetonScriptEvent,
  "addon:trade": RewarditemUse,
  "addon:bank": bankingSystem,
  "minecraft:compass": setting_main,
  "addon:cam": showCameraMenu,
  "addon:emote": emote_main,
  "addon:fullbright_": FullBrightItemUse,
  "minecraft:barrier": mainBanSystem,
};

export function onItemUse(e) {
  try {
    const { source, itemStack } = e;
    if (!(source instanceof Player)) return;
    if (!itemStack) return;
    const itemId = itemStack.typeId;

    if (foods.has(itemId)) {
      DailyFooditemUse(e);
      return;
    }

    const action = ITEM_ACTIONS[itemStack.typeId];
    if (!action) return;

    action(e);
  } catch (err) {
    console.warn(`[itemUse] handler error: ${err}`);
  }
}
console.warn("[world afterEvents itemUse] loaded successfully");
