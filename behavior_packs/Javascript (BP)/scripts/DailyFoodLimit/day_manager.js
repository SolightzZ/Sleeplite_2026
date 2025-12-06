import { world } from "@minecraft/server";
import * as State from "./state.js";
import * as UI from "./ui.js";

let lastday = -1;

export function checkday() {
  const now = Math.floor(world.getAbsoluteTime() / 24000);

  if (now > lastday) {
    if (lastday !== -1) {
      State.resetall();
      UI.playmovie(now);
    }

    lastday = now;
  }
}
