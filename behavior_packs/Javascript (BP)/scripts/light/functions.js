import { ItemStack } from "@minecraft/server";
import { LightBlockList, MaximumParticles, SearchRadius } from "./constants.js";

export function isValidLightBlockItem(item) {
  return item && item.typeId === "minecraft:light_block_13";
}

export function dropLightBlock(attacker, hitBlock) {
  try {
    const dropItemId = "minecraft:light_block_13";

    const blockPosition = {
      x: hitBlock.location.x + 0.5,
      y: hitBlock.location.y + 0.5,
      z: hitBlock.location.z + 0.5,
    };

    attacker.dimension.spawnItem(new ItemStack(dropItemId, 1), blockPosition);
    hitBlock.setType("minecraft:air");
  } catch (error) {
    console.warn(`Error dropLightBlock by ${attacker.name}: ${error}`);
    attacker.sendMessage("§cError dropLightBlock Light Block");
  }
}

export function spawnLightParticles(player) {
  const { x: px, y: py, z: pz } = player.location;
  const dimension = player.dimension;

  const fx = Math.floor(px);
  const fz = Math.floor(pz);
  const minY = Math.max(Math.floor(py - SearchRadius), dimension.heightRange.min);
  const maxY = Math.min(Math.floor(py + SearchRadius), dimension.heightRange.max);

  let particleCount = 0;

  for (let xi = fx - SearchRadius; xi <= fx + SearchRadius && particleCount < MaximumParticles; xi++) {
    for (let zi = fz - SearchRadius; zi <= fz + SearchRadius && particleCount < MaximumParticles; zi++) {
      if (Math.abs(xi - px) + Math.abs(zi - pz) > SearchRadius) continue;

      for (let yi = minY; yi <= maxY && particleCount < MaximumParticles; yi++) {
        const block = dimension.getBlock({ x: xi, y: yi, z: zi });

        if (!block || block.typeId === "minecraft:air") continue;
        if (!LightBlockList.includes(block.typeId)) continue;

        const lightLevel = block.permutation?.getState?.("block_light_level") ?? 0;
        if (lightLevel <= 0) continue;
        player.spawnParticle("light", { x: xi + 0.5, y: yi + 0.65, z: zi + 0.5 });
        particleCount++;
      }
    }
  }
  return particleCount;
}
