import { world, system } from "@minecraft/server";
import { Colors } from "./constants.js";
import { getWorldClock, isDayTime } from "./shareds.js";

let currentDayIndex = -1;
let resetFlag = false;

export function initDaySystem() {
  const clock = getWorldClock();
  currentDayIndex = clock.dayIndex;
}

export function checkNewDayCycle() {
  const { timeOfDay, dayIndex } = getWorldClock();

  if (!isDayTime(timeOfDay)) {
    resetFlag = false;
    return { isNewDay: false };
  }

  if (isDayTime(timeOfDay) && !resetFlag && dayIndex !== currentDayIndex) {
    currentDayIndex = dayIndex;
    resetFlag = true;

    runDayAnimation(dayIndex);

    return { isNewDay: true, dayIndex };
  }

  return { isNewDay: false };
}

function runDayAnimation(day) {
  const frames = ["--", "-- --", "-- D --", "-- DA --", "-- DAY --", `-- DAY ${day} --`];
  let i = 0;

  const tick = () => {
    const text = frames[i] ?? frames[frames.length - 1];
    for (const p of world.getPlayers(p)) {
      try {
        p.onScreenDisplay.setActionBar(text);
        if (i === 0) p.playSound("random.click", { volume: 0.5, pitch: 1.5 });
      } catch {}
    }

    if (i < frames.length) {
      i++;
      system.runTimeout(tick, 4);
    } else {
      world.sendMessage(`${Colors.gold}>> New Day Started: Day ${day}${Colors.white}`);
    }
  };
  tick();
}
