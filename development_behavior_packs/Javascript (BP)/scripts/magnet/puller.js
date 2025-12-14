import { setting } from "./config.js";

export function pullItem(player) {
  try {
    const pos = player.location;
    const world = player.dimension;
    const target = { x: pos.x, y: pos.y + 0.5, z: pos.z };

    const things = world.getEntities({
      location: pos,
      maxDistance: setting.range,
      excludeTypes: ["minecraft:player"],
    });

    let count = 0;
    for (const thing of things) {
      if (count >= setting.maxItem) break;

      if (thing.isValid && setting.canPull.has(thing.typeId)) {
        thing.teleport(target, { dimension: world });
        count++;
      }
    }
  } catch (err) {
    console.warn("pullItem" + err);
  }
}
