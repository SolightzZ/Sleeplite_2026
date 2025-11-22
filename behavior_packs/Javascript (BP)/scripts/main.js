import { world } from "@minecraft/server";
import { startTime, tick } from "./Others/RuntimeInfo.js";

import "./economy/system.js"

import "./DailyFoodLimit/system.js";
import "./Protection/system.js";
import "./ban/system.js";
import "./light/system.js";
import "./Others/gravestones_entity.js";
import "./Others/Hotbar.js";
import "./economy/system.js";
import "./CustomCommand/system.js";

import { startThirstSystem } from "./thirst/system.js";
startThirstSystem();

import "./EndPortalFrame/functions.js"

import { onItemUse } from "./A_itemUse.js";
import { onEntityDeath } from "./B_entityDie.js";
import { onChatMessage } from "./C_chatSend.js";
import { onEntitySpawn } from "./D_EntitySpawn.js";
import { onPlayerLeave } from "./F_playerLeave.js";
import { handlePlayerDimensionChange } from "./BiomeType/system.js";
import { LlightentityHitBlock } from "./light/system.js";
import { onGravestoneInteract } from "./Others/gravestones_entity.js";
import { handlePlaceEye } from "./EndPortalFrame/functions.js";

world.afterEvents.itemUse.subscribe(onItemUse);
world.afterEvents.entityDie.subscribe(onEntityDeath);
world.beforeEvents.chatSend.subscribe(onChatMessage);
world.afterEvents.entitySpawn.subscribe(onEntitySpawn);
world.afterEvents.playerLeave.subscribe(onPlayerLeave);
world.beforeEvents.playerInteractWithBlock.subscribe(handlePlaceEye);
world.afterEvents.playerDimensionChange.subscribe(handlePlayerDimensionChange);
world.afterEvents.entityHitBlock.subscribe(LlightentityHitBlock);
world.beforeEvents.playerInteractWithEntity.subscribe(onGravestoneInteract);

// console.warn(`

//                                 .
//                                   ...
//                                   ....
//                                     ....
//                               ..   .....   .............
//                               ...... ......................
//                             ......  ............       .....
//                           .   .....  .........          .....
//                         ....        .........          ......
//                         .          ........          .......
//                         .         .........       ..........
//                         .....    ...........     ...........
//                       .....    ............    ..........
//                         .. . ................   .........
//               ....     .....................   .......
//                   ...................  .......
//                     ............       .......
//                                         ......
//                               ...        .......
//                             ....         ......
//                               .....       .......
//                               ......     .......
//                                 .......   .......
//                                 ...............
//                                     ...........
//                                         ....

//  .|'''.|  '||                           '||   ||    .               .|'''.|  '||    ||' '||''|.
//  ||..  '   ||    ....    ....  ... ...   ||  ...  .||.    ....      ||..  '   |||  |||   ||   ||
//   ''|||.   ||  .|...|| .|...||  ||'  ||  ||   ||   ||   .|...||      ''|||.   |'|..'||   ||...|'
// .     '||  ||  ||      ||       ||    |  ||   ||   ||   ||         .     '||  | '|' ||   ||
// |'....|'  .||.  '|...'  '|...'  ||...'  .||. .||.  '|.'  '|...'    |'....|'  .|. | .||. .||.
//                                 ||
//                                ''''

// ----------------------------------------------------------------------
//   Sleeplite SMP Server Pack * 2025 SolightzZ | All Rights Reserved
// ----------------------------------------------------------------------
//   Game:         Minecraft Bedrock Edition | Version: 1.21.120
//   Modules:      server, server-ui, server-admin
//   Build:        2025.11.03  | Patch: v1.0
//   Runtime:      Boot ${startTime} | Tick: ${tick} | Zone: THA (UTC+7)
//   Server Type:  Minecraft Server (Vanilla)
//   License:      Internal / MIT
//   Developer:    SolightzZ
//   Docs:         https://github.com/SolightzZ/SleepliteSMP
//   Support:      https://discord.gg/gtqfbmvTJK
//   Status:       Scripts loaded successfully!
// ----------------------------------------------------------------------
//   `);
