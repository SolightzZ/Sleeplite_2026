import { system, world, ItemStack, Player } from "@minecraft/server";
import { board1, board2 } from "./config.js";
import { fixWorld, fixPos } from "./helper.js";
import { getItem } from "./data.js";

function getBoard(name) {
  return world.scoreboard.getObjective(name) ?? world.scoreboard.addObjective(name, name);
}

function addScore(player) {
  if (!player?.scoreboardIdentity) return;

  const realBoard = getBoard(board1);
  realBoard.addScore(player.scoreboardIdentity, 1);
  const fakeBoard = getBoard(board2);
  fakeBoard.addScore(`*${player.name}`, 1);
}

function dropThing(player, hurt) {
  const name = player.name;
  const pos = fixPos(player.location);
  const worldName = fixWorld(player.dimension.id);

  player.sendMessage(`§7[/] ${name} died at §c${pos.x} ${pos.y} ${pos.z} §7in ${worldName}`);

  const itemKey = getItem(name);
  if (!itemKey) return;

  try {
    const src = hurt?.damagingEntity;
    let killer = "Unknown";

    if (src instanceof Player) {
      killer = src.name;
    } else if (src?.typeId) {
      killer = src.typeId.split(":").pop();
    } else if (hurt?.cause) {
      killer = String(hurt.cause);
    }

    const item = new ItemStack(itemKey, 1);
    item.setLore([`§r§8Killer: §9${killer}`, `§r§8Location: §9${pos.x} ${pos.y} ${pos.z}`, `§r§8Dimension: §9${worldName}`]);

    const minY = player.dimension.heightRange.min + 1;
    const y = hurt?.cause === "void" ? Math.max(pos.y, minY) : pos.y;

    player.dimension.spawnItem(item, { ...pos, y });
  } catch (err) {
    console.warn(`[Drop Error] ${err}`);
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
  console.warn(`[System] Death System loaded successfully - Boards: ${board1}, ${board2}`);
});
