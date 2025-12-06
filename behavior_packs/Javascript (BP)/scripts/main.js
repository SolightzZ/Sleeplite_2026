import { world } from "@minecraft/server";

import "./Others/RuntimeInfo.js";
import "./economy/system.js";
import "./DailyFoodLimit/main.js";
import "./Protection/system.js";
import "./ban/system.js";
import "./light/system.js";
import "./Others/gravestones_entity.js";
import "./Others/Hotbar.js";
import "./economy/system.js";
import "./CustomCommand/system.js";
import "./tools/crops/index.js";
import "./tools/hammer/index.js";
import "./DoorAir/main.js";
import "./thirst/main.js";

import { onItemUse } from "./A_itemUse.js";
import { onEntityDeath } from "./B_entityDie.js";
import { onChatMessage } from "./C_chatSend.js";
import { onEntitySpawn } from "./D_EntitySpawn.js";
import { onPlayerLeave } from "./F_playerLeave.js";
import { handlePlayerDimensionChange } from "./BiomeType/system.js";
import { LlightentityHitBlock } from "./light/system.js";
import { onGravestoneInteract } from "./Others/gravestones_entity.js";
import { touch } from "./EndPortalFrame/play.js";

world.afterEvents.itemUse.subscribe(onItemUse);
world.afterEvents.entityDie.subscribe(onEntityDeath);
world.beforeEvents.chatSend.subscribe(onChatMessage);
world.afterEvents.entitySpawn.subscribe(onEntitySpawn);
world.afterEvents.playerLeave.subscribe(onPlayerLeave);
world.beforeEvents.playerInteractWithBlock.subscribe(touch);
world.afterEvents.playerDimensionChange.subscribe(handlePlayerDimensionChange);
world.afterEvents.entityHitBlock.subscribe(LlightentityHitBlock);
world.beforeEvents.playerInteractWithEntity.subscribe(onGravestoneInteract);
