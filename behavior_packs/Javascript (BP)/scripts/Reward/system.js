import { world, system } from "@minecraft/server";
import { AdministratorPlayerTag } from "./constants.js";
import { showRewardSelectionForm } from "./logic.js";
import { resetAllRewardDataAndNotify, logRewardSummaryToConsole } from "./database.js";

export function onRewardItemUse(event) {
  const player = event?.source;
  if (!player) return;

  system.runTimeout(() => showRewardSelectionForm(player), 1);
}

export function onAdministratorChatCommand(event) {
  const player = event.sender;
  const message = event.message;

  if (!player?.hasTag(AdministratorPlayerTag)) return;

  if (message === "!json-login") {
    event.cancel = true;
    logRewardSummaryToConsole();
  } else if (message === "!reset-login") {
    event.cancel = true;
    resetAllRewardDataAndNotify(player);
  }
}
