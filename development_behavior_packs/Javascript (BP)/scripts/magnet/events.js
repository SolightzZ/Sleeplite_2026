import { canUse } from "./validate.js";
import { removeUser } from "./state.js";
import { showMenu } from "./menu.js";

export function onUseItem(event) {
  const player = event.source;
  if (canUse(player)) {
    showMenu(player);
  }
}

export function onLeave(event) {
  removeUser(event.playerId);
}

export function onDie(event) {
  if (event.deadEntity?.typeId === "minecraft:player") {
    removeUser(event.deadEntity.id);
  }
}
