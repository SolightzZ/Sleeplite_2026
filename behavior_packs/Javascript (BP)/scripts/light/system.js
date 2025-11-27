import { world, system } from "@minecraft/server";
import { ActiveUsers, MaximumUsers, CooldownTicks, MaximumParticles } from "./constants.js";
import { isValidLightBlockItem, dropLightBlock, spawnLightParticles } from "./functions.js";

function cleanInactiveUsers() {
  const allPlayers = world.getAllPlayers();
  const onlinePlayersMap = new Map();
  for (const player of allPlayers) {
    onlinePlayersMap.set(player.id, player);
  }

  for (const id of ActiveUsers) {
    const player = onlinePlayersMap.get(id);

    if (!player) {
      ActiveUsers.delete(id);
      continue;
    }

    if (player.getItemCooldown("light_search") <= 0) {
      ActiveUsers.delete(id);
    }
  }
}

function handleLightBlockUse(player) {
  system.runTimeout(() => {
    cleanInactiveUsers();
    if (ActiveUsers.size >= MaximumUsers && !ActiveUsers.has(player.id)) {
      player.onScreenDisplay.setTitle(`§cเต็มแล้ว (${ActiveUsers.size}/${MaximumUsers})`);
      return;
    }

    const cooldown = player.getItemCooldown("light_search");
    if (cooldown > 0) {
      player.onScreenDisplay.setActionBar(`§vLight: ${Math.ceil(cooldown / 20)}s`);
      return;
    }

    ActiveUsers.add(player.id);
    try {
      const count = spawnLightParticles(player);

      if (count >= MaximumParticles) {
        player.onScreenDisplay.setActionBar(`§eแสดงอนุภาคสูงสุด ${MaximumParticles} อนุภาค`);
      } else {
        player.onScreenDisplay.setActionBar(`§aพบ Light Block: ${count} จุด`);
      }

      player.startItemCooldown("light_search", CooldownTicks);
    } catch (error) {
      player.sendMessage("§cเกิดข้อผิดพลาด ในการค้นหา Light Block");
      console.warn("handleLightBlockUse" + error);
    }
  }, 2);
}

function handleLightBlockDestroy(attacker, hitBlock) {
  if (hitBlock.typeId.includes("minecraft:light_block")) {
    dropLightBlock(attacker, hitBlock);
  }
}

export function LlightentityHitBlock(event) {
  const attacker = event.damagingEntity;
  if (!attacker || attacker.typeId !== "minecraft:player" || !attacker.isValid) return;

  const hitBlock = event.hitBlock;
  if (!hitBlock || !hitBlock.typeId) return;

  handleLightBlockDestroy(attacker, hitBlock);
}

export function LligitemUse(event) {
  const player = event.source;
  if (!player || !player.isValid) return;

  if (!isValidLightBlockItem(event.itemStack)) return;
  event.cancel = true;

  handleLightBlockUse(player, event.itemStack);
}

console.warn("Light Block loaded successfully");
