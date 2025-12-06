import { world } from "@minecraft/server";
import { isdoor, getup, dry, run } from "./tools";

world.afterEvents.playerPlaceBlock.subscribe((data) => {
  const block = data.block;

  if (!isdoor(block.typeId)) return;

  const dim = block.dimension;
  const pos = block.location;

  const bottom = block;
  const top = getup(dim, pos);

  run(() => {
    dry(bottom);
    dry(top);
  });
});
