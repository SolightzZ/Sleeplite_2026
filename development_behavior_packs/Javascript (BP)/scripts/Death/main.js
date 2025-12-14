import { system, world, ItemStack, Player } from "@minecraft/server";
import { board1, board2 } from "./config.js";
import { fixWorld, fixPos } from "./helper.js";
import { getItem } from "./data.js";

function getBoard(name) {
  let board = world.scoreboard.getObjective(name);

  if (!board) {
    try {
      board = world.scoreboard.addObjective(name);
    } catch (err) {
      console.warn(`[Board] getBoard '${name}': ${err}`);
    }
  }

  return board;
}

function addScore(player) {
  const card = player.scoreboardIdentity;
  if (!card) return;

  try {
    const score1 = getBoard(board1);
    const score2 = getBoard(board2);

    score1?.addScore(card, 1);
    score2?.addScore(card, 1);
  } catch (err) {
    console.warn(`[Score] addScore: ${err}`);
  }
}

function dropThing(player, hurt) {
  const name = player.name;
  const pos = fixPos(player.location ?? { x: 0, y: 0, z: 0 });
  const world = fixWorld(player.dimension?.id ?? "minecraft:overworld");

  player.sendMessage(`§7[/] ${name} died at ${pos.x} ${pos.y} ${pos.z} in ${world}`);

  const thing = getItem(name);
  if (!thing) return;

  try {
    const bad = hurt?.damagingEntity;
    let badName = "Unknown";

    if (bad) {
      if (bad.typeId === "minecraft:player") {
        badName = bad.name ?? "Unknown Player";
      } else {
        badName = bad.typeId.replace("minecraft:", "");
      }
    } else {
      badName = hurt?.cause ?? "Unknown";
    }

    const item = new ItemStack(thing, 1);
    item.setLore([`§r§8Killer: §9${badName}`, `§r§8Location: §9${pos.x} ${pos.y} ${pos.z}`, `§r§8Dimension: §9${world}`]);

    const drop = hurt?.cause === "void" ? { x: pos.x, y: -55, z: pos.z } : pos;

    player.dimension.spawnItem(item, drop);
  } catch (err) {
    console.warn(`[Drop] getItem (${name}): ${err}`);
  }
}

export function onDieDeaths(event) {
  const dead = event.deadEntity;
  const hurt = event.damageSource;

  if (!(dead instanceof Player)) return;

  system.run(() => {
    dropThing(dead, hurt);
    addScore(dead);
  });
}

system.run(() => {
  getBoard(board1);
  getBoard(board2);
});

console.warn("Death loaded successfully");
