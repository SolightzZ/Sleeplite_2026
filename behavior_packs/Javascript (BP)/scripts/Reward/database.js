import { world } from "@minecraft/server";
import { RewardConfiguration, PlayerRewardDynamicPropertyKey } from "./constants.js";

function isValidRewardDataShape(obj) {
  if (!obj || typeof obj !== "object" || Array.isArray(obj)) return false;
  for (const [key, val] of Object.entries(obj)) {
    if (typeof key !== "string") return false;
    if (!val || typeof val !== "object" || Array.isArray(val)) return false;
    if (typeof val.login !== "number") return false;
    if (!(typeof val.Time === "string" || val.Time === null)) return false;
  }
  return true;
}

export function loadRewardDataOrEmptyObject() {
  try {
    const raw = world.getDynamicProperty(PlayerRewardDynamicPropertyKey);
    if (!raw || typeof raw !== "string") return {};
    const parsed = JSON.parse(raw);
    if (!isValidRewardDataShape(parsed)) throw new Error("Invalid reward data shape");
    return parsed;
  } catch (error) {
    console.warn(`[Reward] Load error: ${error}`);
    return {};
  }
}

export function saveRewardDataOrReturnFalse(data) {
  try {
    const text = JSON.stringify(data);
    if (text.length > RewardConfiguration.MaximumStoredJsonTextLength) {
      throw new Error(`Reward data exceeds size limit (${text.length} > ${RewardConfiguration.MaximumStoredJsonTextLength})`);
    }
    world.setDynamicProperty(PlayerRewardDynamicPropertyKey, text);
    return true;
  } catch (error) {
    console.warn(`[Reward] Save error: ${error}`);
    return false;
  }
}

export function resetAllRewardDataAndNotify(senderPlayer) {
  try {
    world.setDynamicProperty(PlayerRewardDynamicPropertyKey, undefined);
    for (const player of world.getPlayers()) {
      player.sendMessage("§6[*] ข้อมูลรางวัลทั้งหมดถูกล้างแล้ว");
    }
  } catch (error) {
    console.warn(`[Reward] Reset error: ${error}`);
    try {
      senderPlayer?.sendMessage("§c[x] ข้อผิดพลาดขณะล้างข้อมูล");
    } catch {}
  }
}

export function logRewardSummaryToConsole() {
  try {
    const data = loadRewardDataOrEmptyObject();
    const lines = Object.entries(data).map(([name, { login, Time }]) => `${name}: วันที่ ${login || 0}, ล่าสุด: ${Time ?? "Never"}`);
    console.warn(lines.length ? `สรุปข้อมูลรางวัล:\n${lines.join("\n")}` : "ไม่พบข้อมูลรางวัล.");
  } catch (error) {
    console.warn(`[Reward] Summary error: ${error}`);
  }
}
