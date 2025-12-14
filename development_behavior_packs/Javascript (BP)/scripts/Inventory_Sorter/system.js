import { system } from "@minecraft/server";
import { sortPlayerInventory, sortBlockContainer } from "./logic.js";
import { SORTING_MODES } from "./constants.js";

function handleInventoryCommand({ command, mode, player }) {
  if (command === "!r") {
    const res = sortPlayerInventory(player, mode);
    if (res.msg)
      try {
        player.sendMessage(res.msg);
      } catch {}
  } else if (command === "!c") {
    const res = sortBlockContainer(player, mode);
    if (res.msg)
      try {
        player.sendMessage(res.msg);
      } catch {}
  }
}

export function inv_main(event) {
  const [command, rawMode] = event.message.trim().split(/\s+/);
  const player = event.sender;

  const validCommands = ["!r", "!c"];
  if (!validCommands.includes(command)) return;

  const validModes = Object.keys(SORTING_MODES);
  const mode = rawMode?.toLowerCase() ?? "type";

  event.cancel = true;

  if (rawMode && !validModes.includes(mode)) {
    try {
      player.sendMessage(`§cไม่พบโหมด §e"${mode}"§c ที่ระบุ!`);
      player.sendMessage(`§7โหมดที่ใช้งานได้: §a${validModes.join(", ")}`);
    } catch {}
    return;
  }

  system.run(() => handleInventoryCommand({ command, mode, player }));
}

console.warn("Inventory Sorter loaded successfully");
