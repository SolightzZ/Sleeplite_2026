import { system } from "@minecraft/server";

export const isdoor = (id) => id.endsWith("door");
export const getup = (dim, pos) => dim.getBlock({ x: pos.x, y: pos.y + 1, z: pos.z });

export const dry = (block) => {
  if (block && block.isWaterlogged) {
    block.setWaterlogged(false);
  }
};

export const run = (action) => system.run(action);
