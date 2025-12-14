import { world } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { setting } from "./config.js";
import { hasUser, countUser } from "./state.js";
import { canUse } from "./validate.js";
import { toggle } from "./toggle.js";

export function showMenu(player) {
  if (!canUse(player)) return;

  const isOn = hasUser(player.id);
  const total = countUser();

  let btnText = isOn ? "Magnet: §aON" : "Magnet: §cOFF";
  let btnIcon = isOn ? setting.icon.on : setting.icon.off;

  if (!isOn && total >= setting.maxPeople) {
    btnText = `§cFull (${setting.maxPeople})`;
    btnIcon = setting.icon.full;
  }

  const people = world.getAllPlayers();
  const names =
    people
      .filter((p) => hasUser(p.id))
      .map((p) => `§7» §f${p.name}`)
      .join("\n") || "§8* ไม่มีคนใช้งาน";

  new ActionFormData()
    .title(`Magnet [${total}/${setting.maxPeople}]`)
    .body(names)
    .button(btnText, btnIcon)
    .show(player)
    .then((result) => {
      if (!result.canceled && result.selection === 0) {
        toggle(player, !isOn);
      }
    });
}
