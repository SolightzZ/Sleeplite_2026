import { world, system, Player } from "@minecraft/server";
import { config, menu, lists } from "./data.js";
import { calcCost, checkHeal } from "./lib.js";
import { getWater, setWater, showBar, playBurp, giveMagic } from "./io.js";

const runSafe = (fnName, fn) => (event) => {
  try {
    fn(event);
  } catch (e) {
    console.warn(`[${fnName}] ${e}`);
  }
};

const isBadMode = (p) => config.badModes.includes(p.getGameMode());

const onEat = ({ source: player, itemStack: item }) => {
  if (!(player instanceof Player) || !item || isBadMode(player)) return;
  const food = menu[item.typeId];
  if (!food) return;

  setWater(player, getWater(player) + (food.add ?? 0));
  giveMagic(player, food.magic);
};

const onDrinkPot = ({ player, block, itemStack: item }) => {
  if (!(player instanceof Player) || !player.isSneaking || item || isBadMode(player)) return;
  if (block?.typeId !== "minecraft:cauldron") return;
  if (getWater(player) >= config.full) return;

  const perm = block.permutation;
  if (perm.getState("fill_level") <= 0 || perm.getState("cauldron_liquid") !== "water") return;

  system.run(() => {
    block.setPermutation(perm.withState("fill_level", perm.getState("fill_level") - 1));
    if (Math.random() < 0.5) player.addEffect("poison", 80, { amplifier: 0, showParticles: false });
    playBurp(player);
    setWater(player, getWater(player) + 7);
  });
};

const onDrinkCow = ({ player, target, itemStack: item }) => {
  if (!(player instanceof Player) || !player.isSneaking || item || isBadMode(player)) return;
  if (!lists.cows.includes(target?.typeId)) return;
  if (getWater(player) >= config.full) return;

  system.run(() => {
    const now = Date.now();
    const last = target.getDynamicProperty(config.cowTimerKey) ?? 0;
    if (now - last < config.cowWait * 1000) return;

    target.setDynamicProperty(config.cowTimerKey, now);

    if (target.typeId === "minecraft:mooshroom") {
      if (Math.random() < 0.5) {
        player.addEffect("poison", 100, { showParticles: false });
      } else {
        player.addEffect("nausea", 200, { showParticles: false });
        player.addEffect("hunger", 200, { showParticles: false });
      }
    }

    playBurp(player);
    setWater(player, getWater(player) + 3);
  });
};

const onDrinkFloor = ({ player, isFirstEvent, itemStack: item }) => {
  if (!(player instanceof Player) || !isFirstEvent || !player.isSneaking) return;
  if (player.isInWater || item || isBadMode(player) || getWater(player) >= config.full) return;

  const hit = player.getBlockFromViewDirection({ includeLiquidBlocks: true, includePassableBlocks: true });
  if (!hit) return;

  system.run(() => {
    const rot = player.getRotation();
    const dir = { x: -Math.sin((rot.y * Math.PI) / 180), z: Math.cos((rot.y * Math.PI) / 180) };
    const blockDown = player.dimension.getBlock({ x: player.location.x + dir.x, y: player.location.y - 1, z: player.location.z + dir.z });

    const seeWater = lists.waters.includes(hit.block?.typeId ?? "");
    const feetWater = lists.waters.includes(blockDown?.typeId ?? "");

    if (seeWater || feetWater) {
      if (Math.random() < 0.65) player.addEffect("poison", 80, { showParticles: false });
      playBurp(player);
      setWater(player, getWater(player) + 7);
    }
  });
};

const runLoop = () => {
  const diff = (world.getDifficulty?.() ?? "normal").toString().toLowerCase();
  const tick = system.currentTick;

  for (const player of world.getPlayers({ excludeGameModes: config.badModes })) {
    const currentWater = getWater(player);
    const moveVector = player.inputInfo?.getMovementVector?.() ?? { x: 0, z: 0 };
    const isMoving = moveVector.x !== 0 || moveVector.z !== 0;

    const dropCost = calcCost(isMoving, player.isSprinting, player.inputInfo?.isJumping, currentWater, diff);

    const hp = player.getComponent("health");
    const healInfo = hp ? checkHeal(hp.currentValue, hp.effectiveMax, currentWater) : { doHeal: false, cost: 0 };

    if (healInfo.doHeal) {
      hp.setCurrentValue(hp.currentValue + healInfo.amount);
    }

    const nextWater = currentWater - dropCost - healInfo.cost;
    setWater(player, nextWater);

    if (tick % config.hurtTime === 0) {
      const w = Math.floor(nextWater);
      if (w <= 6) player.addEffect("slowness", 100, { showParticles: false });
      if (w <= 2) player.addEffect("nausea", 100, { showParticles: false });
      if (w <= 0)
        try {
          player.applyDamage(2);
        } catch {}
    }

    if (tick % config.showTime === 0) {
      showBar(player);
    }
  }
};

export const events = {
  eat: runSafe("eat", onEat),
  drinkPot: runSafe("drinkPot", onDrinkPot),
  drinkCow: runSafe("drinkCow", onDrinkCow),
  drinkFloor: runSafe("drinkFloor", onDrinkFloor),
  loop: runSafe("loop", runLoop),
  join: runSafe("join", ({ player }) => {
    if (getWater(player) === undefined) setWater(player, config.full);
    showBar(player);
  }),
  die: runSafe("die", ({ deadEntity }) => {
    if (deadEntity instanceof Player) {
      setWater(deadEntity, config.full);
      showBar(deadEntity);
    }
  }),
};
