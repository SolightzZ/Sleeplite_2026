import { ITEMPACK } from "./constants.js";

// Map block → item
export const blockItemMap = new Map();
export let blockCounter = 1;

export function getItemForBlock(block) {
  for (const [num, data] of blockItemMap.entries()) {
    if (
      data.block === block.typeId &&
      data.x === block.location.x &&
      data.y === block.location.y &&
      data.z === block.location.z
    ) {
      return data;
    }
  }

  const itemIndex = (blockCounter - 1) % ITEMPACK.length;
  const item = ITEMPACK[itemIndex];

  blockItemMap.set(blockCounter.toString(), {
    block: block.typeId,
    x: block.location.x,
    y: block.location.y,
    z: block.location.z,
    Item: item.id,
    hp: item.hp,
  });

  blockCounter++;
  return blockItemMap.get((blockCounter - 1).toString());
}

export function removeBlockItem(block) {
  for (const [num, data] of blockItemMap.entries()) {
    if (
      data.block === block.typeId &&
      data.x === block.location.x &&
      data.y === block.location.y &&
      data.z === block.location.z
    ) {
      blockItemMap.delete(num);
      break;
    }
  }
}
