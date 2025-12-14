import { world, system } from "@minecraft/server";
import { setting } from "./config.js";
import { hasTimer, setTimer, clearTimer, getAllUsers, hasUser, removeUser } from "./state.js";
import { pullItem } from "./puller.js";

export function start() {
  if (hasTimer()) return;

  const id = system.runInterval(() => {
    try {
      if (getAllUsers().length === 0) {
        stop();
        return;
      }

      const people = world.getAllPlayers();
      const online = new Set();

      for (const person of people) {
        online.add(person.id);

        if (hasUser(person.id)) {
          pullItem(person);
        }
      }

      for (const userId of getAllUsers()) {
        if (!online.has(userId)) removeUser(userId);
      }
    } catch (err) {
      console.warn(`[Magnet] Loop Error: ${err}`);
    }
  }, setting.speed);
  setTimer(id);
}

export function stop() {
  if (hasTimer()) {
    system.clearRun(getTimer());
    clearTimer();
  }
}
