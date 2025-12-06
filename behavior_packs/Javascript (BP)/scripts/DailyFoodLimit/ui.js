import { world, system } from "@minecraft/server";
import { colors } from "./constants.js";

export function warn(player, food, max) {
  const msg = `${colors.red}Limit: ${food} (${max}/${max})`;
  player.onScreenDisplay.setActionBar(msg);
  player.playSound("note.bass", { volume: 0.5 });
}

export function success(player, food, now, max) {
  const msg = `${colors.green}+ ${food} ${colors.white}(${now}/${max})`;
  player.onScreenDisplay.setActionBar(msg);
}

export function playmovie(day) {
  const frames = [" ", "-", "--", "-- D --", "-- DA --", `-- DAY ${day} --`, "-- DA --", "-- D --", "--", "-", " "];

  let i = 0;

  const run = () => {
    if (i >= frames.length) return;

    const text = frames[i];
    const delay = text.includes(day.toString()) ? 30 : 5;

    for (const p of world.getPlayers()) {
      p.onScreenDisplay.setActionBar(`${colors.gray}${text}`);
      if (text.trim().length > 0) {
        p.playSound("random.click", { volume: 0.5 });
      }
    }

    i++;
    system.runTimeout(run, delay);
  };

  run();
}
