import { Player } from "@minecraft/server";

import { showCameraMenu } from "./Camera/system.js";
import { startEmote } from "./Emote/system.js";
import { FullBrightItemUse } from "./FullBright/system.js";
import { onUseItem } from "./magnet/events.js";
import { mainBanSystem } from "./ban/system.js";
import { RewarditemUse } from "./Reward/system.js";
import { setting_main } from "./Others/setting.js";
import { bankingSystem } from "./economy/system.js";
import { ZoneProtection_OnItemUse } from "./Protection/system.js";
import { LligitemUse } from "./light/main.js";
import { DailyFooditemUse } from "./DailyFoodLimit/main.js";
import { foods } from "./DailyFoodLimit/constants.js";
import { RUNREPORT } from "./report/main.js";
import { chatrankssitemUse } from "./Others/chatrankss.js";

const ITEM_ACTIONS = {
  "addon:protection": ZoneProtection_OnItemUse,
  "minecraft:light_block_13": LligitemUse,
  "addon:magnet_": onUseItem,
  "addon:trade": RewarditemUse,
  "addon:bank": bankingSystem,
  "minecraft:compass": setting_main,
  "addon:cam": showCameraMenu,
  "addon:emote": startEmote,
  "addon:fullbright_": FullBrightItemUse,
  "minecraft:barrier": mainBanSystem,
  "minecraft:paper": RUNREPORT,
  "minecraft:command_block": chatrankssitemUse,
};

export function onItemUse(e) {
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
}
console.warn("[world afterEvents itemUse] loaded successfully");
