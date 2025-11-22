import { system } from "@minecraft/server";

function getString() {
  const utcNow = Date.now();
  const offsetMs = 7 * 60 * 60 * 1000;
  const thaiTime = new Date(utcNow + offsetMs);

  return thaiTime.toLocaleString("th-TH", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

export const startTime = getString();
export const tick = typeof system.currentTick === "number" ? system.currentTick : 0;
