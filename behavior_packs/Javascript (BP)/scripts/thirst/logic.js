import { world, system, Player } from "@minecraft/server";
import {
  BlockedGameModes,
  PlayerThirstDynamicPropertyKey,
  EntityLastDrinkTimeDynamicPropertyKey,
  ThirstMaximum,
  ShowEffectEveryNTicks,
  RefreshTitleEveryNTicks,
  DrinkFromEntityCooldownSeconds,
} from "./constants.js";
import {
  getPlayerThirstOrDefault,
  setPlayerThirstAndUpdateTitle,
  showPlayerThirstTitleNow,
  isPlayerMovingByInputVector,
  computeMovementThirstDrainPerTick,
  regenerateHealthAndReturnThirstCost,
} from "./functions.js";
import { ThirstItemEffectsByTypeId, DrinkableBlockTypeIds, DrinkableEntityTypeIds } from "./database.js";

function isPlayerInBlockedGameMode(player) {
  return BlockedGameModes.includes(player.getGameMode());
}

export function onPlayerFirstSpawnOrJoin({ player }) {
  const hasValue = player.getDynamicProperty(PlayerThirstDynamicPropertyKey);
  if (hasValue === undefined || hasValue === null) {
    player.setDynamicProperty(PlayerThirstDynamicPropertyKey, ThirstMaximum);
  }
  showPlayerThirstTitleNow(player);
}

export function onPlayerDeathResetThirst(event) {
  const entity = event.deadEntity;
  if (entity instanceof Player) {
    entity.setDynamicProperty(PlayerThirstDynamicPropertyKey, ThirstMaximum);
    showPlayerThirstTitleNow(entity);
  }
}

export function onItemCompleteUse(event) {
  const player = event.source;
  const item = event.itemStack;
  if (!(player instanceof Player)) return;
  if (!item) return;
  if (isPlayerInBlockedGameMode(player)) return;

  const config = ThirstItemEffectsByTypeId[item.typeId];
  if (!config) return;

  setPlayerThirstAndUpdateTitle(player, getPlayerThirstOrDefault(player) + (config.thirstDelta ?? 0));

  if (config.effect) {
    const chance = (config.effect.chancePercent ?? 100) / 100;
    if (Math.random() <= chance) {
      const ticks = (config.effect.seconds ?? 0) * 20;
      player.addEffect(config.effect.id, ticks, { amplifier: 0, showParticles: false });
    }
  }
}

export function onInteractWithCauldron(event) {
  const player = event.player;
  const block = event.block;
  const item = event.itemStack;

  if (!(player instanceof Player)) return;
  if (!player.isSneaking) return;
  if (item) return;
  if (isPlayerInBlockedGameMode(player)) return;
  if (block?.typeId !== "minecraft:cauldron") return;
  if (getPlayerThirstOrDefault(player) > ThirstMaximum - 1) return;

  try {
    const permutation = block.permutation;
    const level = permutation.getState("fill_level");
    const liquid = permutation.getState("cauldron_liquid");
    if (level <= 0 || liquid !== "water") return;

    system.run(() => {
      block.setPermutation(permutation.withState("fill_level", level - 1));
      if (Math.random() < 0.5) {
        player.addEffect("poison", 80, { amplifier: 0, showParticles: false });
      }
      try {
        player.playSound("random.burp");
      } catch {}
      setPlayerThirstAndUpdateTitle(player, getPlayerThirstOrDefault(player) + 7);
    });
  } catch (e) {
    console.warn(`[Thirst] Cauldron interaction error: ${e}`);
  }
}

export function onInteractWithEntityToDrink(event) {
  const player = event.player;
  const target = event.target;
  const item = event.itemStack;

  if (!(player instanceof Player)) return;
  if (!player.isSneaking) return;
  if (item) return;
  if (isPlayerInBlockedGameMode(player)) return;
  if (!target || !DrinkableEntityTypeIds.includes(target.typeId)) return;
  if (getPlayerThirstOrDefault(player) > ThirstMaximum - 1) return;

  system.run(() => {
    const now = Date.now();
    const lastMillis = target.getDynamicProperty(EntityLastDrinkTimeDynamicPropertyKey) ?? 0;
    if (now - lastMillis < DrinkFromEntityCooldownSeconds * 1000) return;
    target.setDynamicProperty(EntityLastDrinkTimeDynamicPropertyKey, now);

    if (target.typeId === "minecraft:mooshroom") {
      if (Math.random() < 0.5) {
        player.addEffect("poison", 100, { amplifier: 0, showParticles: false });
      } else {
        player.addEffect("nausea", 200, { amplifier: 0, showParticles: false });
        player.addEffect("hunger", 200, { amplifier: 0, showParticles: false });
      }
    }

    try {
      player.playSound("random.burp");
    } catch {}
    setPlayerThirstAndUpdateTitle(player, getPlayerThirstOrDefault(player) + 3);
  });
}

export function onInteractWithWaterSurface(event) {
  const player = event.player;
  const isInitial = event.isFirstEvent;
  const item = event.itemStack;

  if (!(player instanceof Player)) return;
  if (!isInitial) return;
  if (!player.isSneaking) return;
  if (player.isInWater) return;
  if (item) return;
  if (isPlayerInBlockedGameMode(player)) return;
  if (getPlayerThirstOrDefault(player) > ThirstMaximum - 1) return;

  const hit = player.getBlockFromViewDirection({ includeLiquidBlocks: true, includePassableBlocks: true });
  if (!hit) return;

  system.run(() => {
    const rotation = player.getRotation();
    const direction = { x: -Math.sin((rotation.y * Math.PI) / 180), z: Math.cos((rotation.y * Math.PI) / 180) };
    const blockBelowFront = player.dimension.getBlock({
      x: player.location.x + direction.x,
      y: player.location.y - 1,
      z: player.location.z + direction.z,
    });

    const lookingIsWater = DrinkableBlockTypeIds.includes(hit.block?.typeId ?? "");
    const belowIsWater = DrinkableBlockTypeIds.includes(blockBelowFront?.typeId ?? "");

    if (lookingIsWater || belowIsWater) {
      if (Math.random() < 0.65) {
        player.addEffect("poison", 80, { amplifier: 0, showParticles: false });
      }
      try {
        player.playSound("random.burp");
      } catch {}
      setPlayerThirstAndUpdateTitle(player, getPlayerThirstOrDefault(player) + 7);
    }
  });
}

export function onScriptEventReceive(event) {
  const { id, sourceEntity, message } = event;
  if (!(sourceEntity instanceof Player)) return;
  if (!id.startsWith("thirst:")) return;

  const command = id.slice("thirst:".length);
  if (command === "set") {
    const amount = Number(message);
    if (Number.isFinite(amount)) {
      setPlayerThirstAndUpdateTitle(sourceEntity, clampFinite(amount));
      sourceEntity.sendMessage(`(Dev) ตั้งค่ากระหายน้ำเป็น ${amount}`);
    }
  }
}

function clampFinite(value) {
  if (!Number.isFinite(value)) return ThirstMaximum;
  if (value < 0) return 0;
  if (value > ThirstMaximum) return ThirstMaximum;
  return value;
}

export function mainThirstTickLoop() {
  const difficultyKey = String(world.getDifficulty?.() ?? "normal").toLowerCase();
  const tickNow = system.currentTick;

  for (const player of world.getPlayers({ excludeGameModes: BlockedGameModes })) {
    const previousThirst = getPlayerThirstOrDefault(player);

    const movementDrain = computeMovementThirstDrainPerTick(player, isPlayerMovingByInputVector(player), difficultyKey);
    const regenerationCost = regenerateHealthAndReturnThirstCost(player, difficultyKey);

    const nextThirst = previousThirst - movementDrain - regenerationCost;
    setPlayerThirstAndUpdateTitle(player, nextThirst);

    if (tickNow % ShowEffectEveryNTicks === 0) {
      const currentFloor = Math.floor(getPlayerThirstOrDefault(player));
      if (currentFloor <= 6) player.addEffect("slowness", 100, { amplifier: 0, showParticles: false });
      if (currentFloor <= 2) player.addEffect("nausea", 100, { amplifier: 0, showParticles: false });
      if (currentFloor <= 0) {
        try {
          player.applyDamage(3);
        } catch {}
      }
    }

    if (tickNow % RefreshTitleEveryNTicks === 0) {
      showPlayerThirstTitleNow(player);
    }
  }
}
