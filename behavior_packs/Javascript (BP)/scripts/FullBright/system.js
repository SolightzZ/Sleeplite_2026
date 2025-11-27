import { showFullBrightMenu } from "./functions.js";
import { FullBrightonEntityDeath, FullBrightonPlayerLeave } from "./database.js";
import { system } from "@minecraft/server";

export function FullBrightItemUse({ source: player }) {
  system.run(() => showFullBrightMenu(player));
}

export { FullBrightonEntityDeath, FullBrightonPlayerLeave };

console.warn("Full Bright loaded successfully");
