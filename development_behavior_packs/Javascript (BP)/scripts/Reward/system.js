import { world, system } from "@minecraft/server";
import { menu } from "./logic.js";
import { reset, load } from "./database.js";
import { config } from "./constants.js";

export function RewarditemUse(event) {
  const p = event.source;
  system.runTimeout(() => {
    menu(p);
  });
}

export function RewardchatSend(event) {
  const p = event.sender;
  const msg = event.message;

  if (!p.hasTag(config.adminTag)) return;

  if (msg === "!reset-login") {
    event.cancel = true;
    reset(p);
    p.sendMessage("§e[Admin] Data Reset!");
  } else if (msg === "!check-reward") {
    event.cancel = true;
    let text = "=== Player Status ===\n";

    for (const target of world.getPlayers()) {
      const db = load(target);
      text += `§7${target.name}: Count=${db.count}, Last=${db.last || "Never"}\n`;
    }
    console.warn(text);
    p.sendMessage(text);
  }
}
console.warn("Reward loaded successfully");
