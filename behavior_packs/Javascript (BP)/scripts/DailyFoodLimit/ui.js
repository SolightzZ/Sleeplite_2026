import { system, world } from "@minecraft/server";
import { COLORS } from "./config.js";

export const showLimitWarning = (player, itemName, max) => {
  system.run(() => {
    player.onScreenDisplay.setActionBar(`${COLORS.red}Limit: ${itemName} (${max}/${max})`);
    player.playSound("note.bass", { volume: 0.5 });
  });
};

export const showSuccessMessage = (player, itemName, current, max) => {
  system.run(() => {
    player.onScreenDisplay.setActionBar(`${COLORS.green}+ ${itemName} ${COLORS.white}(${current}/${max})`);
  });
};

export const playNewDayAnimation = (dayNumber) => {
  const textFrames = [" ", "-", "--", "-- D --", "-- DAY --", `-- DAY ${dayNumber} --`, "-- DAY --", "-- D --", "--", "-", " "];

  let frameIndex = 0;
  const runFrame = () => {
    if (frameIndex >= textFrames.length) return;

    const text = textFrames[frameIndex];
    const duration = text.includes(dayNumber.toString()) ? 30 : 8;

    for (const player of world.getPlayers()) {
      player.onScreenDisplay.setActionBar(`${COLORS.gold}${text}`);
      if (text.trim().length > 0) player.playSound("random.click", { volume: 1 });
    }
    frameIndex++;
    system.runTimeout(runFrame, duration);
  };
  runFrame();
};
