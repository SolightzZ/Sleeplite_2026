import { world, ItemStack, system } from "@minecraft/server";
import { BLOCK, ITEM, TAG, RADIUS, MIN } from "./constants.js";
import { getItemForBlock, removeBlockItem } from "./database.js";

function getDistance(posA, posB) {
  const dx = posA.x - posB.x;
  const dy = posA.y - posB.y;
  const dz = posA.z - posB.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

function getNearbyPlayers(block) {
  return world
    .getPlayers()
    .filter((p) => getDistance(p.location, block.location) <= RADIUS);
}

function playerHasItem(player, itemId) {
  try {
    const inv = player.getComponent("minecraft:inventory").container;
    for (let i = 0; i < inv.size; i++) {
      const item = inv.getItem(i);
      if (item?.typeId === itemId) return true;
    }
  } catch (err) {
    console.error("playerHasItem error:", err);
  }
  return false;
}

function consumeItem(player, itemId) {
  try {
    system.run(() => {
      const inv = player.getComponent("minecraft:inventory").container;
      for (let i = 0; i < inv.size; i++) {
        const item = inv.getItem(i);
        if (item?.typeId === itemId) {
          const newAmount = item.amount - 1;
          inv.setItem(i,newAmount > 0 ? new ItemStack(item.typeId, newAmount) : undefined);
          break;
        }
      }
    });
  } catch (err) {
    console.error("consumeItem error:", err);
  }
}

function applyDamageSafe(player, damage) {
  try {
    if (damage <= 0) return;
    system.run(() => {
      const health = player.getComponent("minecraft:health");
      if (health && health.currentValue > damage) {
        player.applyDamage(damage);
      }
    });
  } catch (err) {
    console.error("applyDamageSafe error:", err);
  }
}

function format(itemId) {
  const parts = itemId.split(":");
  const name = parts.length > 1 ? parts[1] : parts[0];
  return name
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function handlePlaceEye(event) {
  try {
    const player = event.player;
    const block = event.block;
    const item = event.itemStack;

    if (!player || !block) return;
    if (block.typeId !== BLOCK) return;
    if (item?.typeId !== ITEM) return;
    if (player.hasTag(TAG)) return;

    const nearbyPlayers = getNearbyPlayers(block);
    if (nearbyPlayers.length < MIN) {
      const textmin = `§d[End Portal] §7Player > ${MIN} | Radius ${RADIUS} Block`;
      event.cancel = true;
      system.run(() => {
        player.onScreenDisplay.setActionBar(textmin);
      });
      return;
    }

    const requiredItem = getItemForBlock(block);
    const Text = `§d[End Portal] §7Item: ${format(requiredItem.Item)}`;
    const Texthp = `§a[/] §7Item: ${format(requiredItem.Item)} | Damage: ${requiredItem.hp} `;

    if (!playerHasItem(player, requiredItem.Item)) {
      event.cancel = true;
      
      system.run(() => {
        player.onScreenDisplay.setActionBar(Text);
      });
      return;
    }

    consumeItem(player, requiredItem.Item);
    applyDamageSafe(player, requiredItem.hp);
    player.sendMessage(Texthp)
    removeBlockItem(block);
  } catch (err) {
    console.error("handlePlaceEye error:", err);
  }
}