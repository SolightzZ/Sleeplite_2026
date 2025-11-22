import { world, system } from "@minecraft/server";
import { CHECK_INTERVAL, MAX_UI_OPS_PER_TICK, BROADCAST_MIN_GAP_TICKS, METRICS_FLUSH_EVERY_TICKS, FOOD_SET, DP } from "./constants.js";
import { isFeatureEnabled } from "./functions.js";
import { beforeUseFood, afterUseFood, checkAndMaybeResetDay } from "./logic.js";

const metrics = {
  before_blocked: 0,
  after_ok: 0,
  resets: 0,
  errors: 0,
  ui_ops: 0,
};

const uiQueue = [];
let lastBroadcastTick = -Infinity;

function queueUi(job) {
  if (typeof job === "function") uiQueue.push(job);
}

function drainUiQueueWithBudget() {
  let budget = MAX_UI_OPS_PER_TICK;
  while (budget-- > 0 && uiQueue.length > 0) {
    try {
      uiQueue.shift()();
      metrics.ui_ops++;
    } catch {
      metrics.errors++;
    }
  }
}

function playDayAnimationBatch(dayIndex) {
  if (!isFeatureEnabled(DP.FEATURE_ANIM, true)) return;
  const frames = ["--", "-- --", "-- D --", `-- DAY ${dayIndex} --`];
  let i = 0;
  const tickFrame = () => {
    const msg = frames[i] ?? frames.at(-1);
    for (const p of world.getPlayers()) {
      queueUi(() => {
        try {
          p.playSound("random.click", { volume: 0.75 });
          p.onScreenDisplay.setActionBar(msg);
        } catch {
          metrics.errors++;
        }
      });
    }
    if (i < frames.length) {
      i++;
      system.runTimeout(tickFrame, 5);
    }
  };
  tickFrame();
}

world.beforeEvents.itemUse.subscribe((ev) => {
  const item = ev.itemStack;
  if (!item || !FOOD_SET.has(item.typeId)) return;

  const result = beforeUseFood(ev.source, item.typeId);
  if (result.blocked) {
    ev.cancel = true;
    metrics.before_blocked++;
    queueUi(() => {
      try {
        ev.source.onScreenDisplay.setTitle(result.msg);
      } catch {
        metrics.errors++;
      }
    });
  }
});

world.afterEvents.itemCompleteUse.subscribe((ev) => {
  const item = ev.itemStack;
  if (!item || !FOOD_SET.has(item.typeId)) return;

  const result = afterUseFood(ev.source, item.typeId);
  if (result.actionBarMsg) {
    metrics.after_ok++;
    queueUi(() => {
      try {
        ev.source.onScreenDisplay.setActionBar(result.actionBarMsg);
      } catch {
        metrics.errors++;
      }
    });
  }
});

let lastDayIndex = -1;
let tickCounter = 0;

system.runInterval(() => {
  tickCounter++;

  drainUiQueueWithBudget();

  if (tickCounter % CHECK_INTERVAL === 0) {
    const result = checkAndMaybeResetDay();
    if (result.shouldReset && result.dayIndex !== lastDayIndex) {
      lastDayIndex = result.dayIndex;
      metrics.resets++;

      if (isFeatureEnabled(DP.FEATURE_BROADCAST, true)) {
        const nowTick = tickCounter;
        if (nowTick - lastBroadcastTick >= BROADCAST_MIN_GAP_TICKS) {
          lastBroadcastTick = nowTick;
          queueUi(() => {
            try {
              world.sendMessage(result.broadcastMsg);
            } catch {
              metrics.errors++;
            }
          });
        }
      }

      playDayAnimationBatch(result.dayIndex);
    }
  }

  if (tickCounter % METRICS_FLUSH_EVERY_TICKS === 0) {
    const msg =
      `[food][metrics] blocked=${metrics.before_blocked}, ok=${metrics.after_ok}, ` +
      `resets=${metrics.resets}, ui=${metrics.ui_ops}, err=${metrics.errors}`;
    try {
      console.warn(msg);
    } catch {}

    metrics.ui_ops = 0;
    metrics.errors = 0;
  }
}, 1);
