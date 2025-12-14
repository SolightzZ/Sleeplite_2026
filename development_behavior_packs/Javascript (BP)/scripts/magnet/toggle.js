import { setting } from "./config.js";
import { addUser, removeUser, hasUser, countUser } from "./state.js";
import { canUse } from "./validate.js";
import { start } from "./loop.js";

export function toggle(player, turnOn) {
  if (!canUse(player)) return;

  const userId = player.id;
  const nowCount = countUser();

  if (turnOn) {
    if (nowCount >= setting.maxPeople && !hasUser(userId)) {
      player.onScreenDisplay.setActionBar(setting.text.full(setting.maxPeople));
      player.playSound("random.anvil_land", { volume: 0.5, pitch: 1.5 });
      return;
    }

    addUser(userId);
    player.onScreenDisplay.setActionBar(setting.text.on);
    player.playSound("beacon.power", { volume: 1, pitch: 1.5 });
    start();
  } else {
    removeUser(userId);
    player.onScreenDisplay.setActionBar(setting.text.off);
    player.playSound("beacon.deactivate", { volume: 1, pitch: 1.5 });
  }
}
