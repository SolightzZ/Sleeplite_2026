import { world } from "@minecraft/server";
import { disableFullBright } from "./database.js";

export function FullBrightonPlayerLeave(event) {
  const playerId = event.playerId;
  if (typeof playerId !== "string") return;

  try {
    const player = world.getEntity(playerId);
    if (player?.typeId === "minecraft:player") {
      disableFullBright(player);
    }
  } catch (err) {
    console.warn(`[FullBright] Cleanup failed for ${playerId}: ${err}`);
  }
}

export function FullBrightonEntityDeath({ deadEntity: entity }) {
  if (entity?.typeId === "minecraft:player") {
    disableFullBright(entity);
  }
}
