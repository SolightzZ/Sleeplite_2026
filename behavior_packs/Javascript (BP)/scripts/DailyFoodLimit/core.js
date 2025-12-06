import { system } from "@minecraft/server";
import { rules, foods } from "./constants.js";
import * as State from "./state.js";
import * as Utils from "./utils.js";
import * as UI from "./ui.js";

const spam = new Map();

export function tryeat(player, item, event) {
  const id = item.typeId;

  if (!Utils.isfood(foods, id)) return;

  const name = Utils.fixname(id);
  const count = State.getcount(player.id, id);

  if (count >= rules.max) {
    event.cancel = true;

    const tick = system.currentTick;
    const last = spam.get(player.id) || 0;

    if (tick - last > rules.spamwait) {
      UI.warn(player, name, rules.max);
      spam.set(player.id, tick);
    }
  }
}

export function ate(player, item) {
  if (!item) return;
  const id = item.typeId;

  if (!Utils.isfood(foods, id)) return;

  const name = Utils.fixname(id);
  const newcount = State.add(player.id, id);

  UI.success(player, name, newcount, rules.max);
}

export function clean(playerid) {
  State.clear(playerid);
  spam.delete(playerid);
}
