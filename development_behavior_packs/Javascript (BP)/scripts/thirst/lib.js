import { config, rates } from "./data.js";

export const fixNum = (val) => Math.min(Math.max(val, config.empty), config.full);

export const calcCost = (isMoving, isSprinting, isJumping, waterLevel, diff) => {
  if (!isMoving) return 0;
  const base = rates.drop[diff] ?? rates.drop.normal;
  const run = isSprinting ? rates.cost.run : 1;
  const jump = isJumping ? 1 + rates.cost.jump : 1;
  const dry = waterLevel < 18 ? 1 + rates.cost.dry : 1;
  return base * run * jump * dry;
};

export const checkHeal = (currentHp, maxHp, waterLevel) => {
  const need = maxHp - currentHp;
  const canHeal = need >= 1 && need !== maxHp && waterLevel > 16;
  if (!canHeal) return { doHeal: false, cost: 0 };

  const amount = need / (maxHp + need);
  return { doHeal: true, amount: amount, cost: config.healPrice };
};
