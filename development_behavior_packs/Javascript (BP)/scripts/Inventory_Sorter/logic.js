import {
  compareItemsByMode,
  sortAndMergeItems,
  isInventorySortedAndMerged,
  writeContainerDiff,
  normalizeMode,
  formatBlockName,
} from "./functions.js";
import { SETTINGS } from "./constants.js";

export function sortPlayerInventory(player, mode) {
  const inv = player.getComponent("minecraft:inventory")?.container;
  if (!inv) return { ok: false, msg: "§cไม่พบ Inventory ของผู้เล่น" };

  const invSize = inv.size;
  const hotbarSize = SETTINGS.HOTBAR_SIZE;
  const sortMode = normalizeMode(mode);

  const items = Array.from({ length: invSize }, (_, i) => inv.getItem(i));
  const hotbar = items.slice(0, hotbarSize);
  const main = items.slice(hotbarSize);

  const hotbarDone = isInventorySortedAndMerged(hotbar, hotbarSize, sortMode);
  const mainDone = isInventorySortedAndMerged(main, invSize - hotbarSize, sortMode);

  const newHotbar = hotbarDone ? hotbar : sortAndMergeItems(hotbar, hotbarSize).sort((a, b) => compareItemsByMode(a, b, sortMode));

  const newMain = mainDone ? main : sortAndMergeItems(main, invSize - hotbarSize).sort((a, b) => compareItemsByMode(a, b, sortMode));

  const sorted = [...newHotbar, ...newMain];
  writeContainerDiff(inv, sorted);

  return { ok: true, msg: `§e[Hotbar]§r เรียงสำเร็จ§r ${sortMode.toUpperCase()} §7(!r ${sortMode})` };
}

export function sortBlockContainer(player, mode) {
  const bv = player.getBlockFromViewDirection?.();
  const block = bv?.block;
  if (!block) return { ok: false, msg: "§cไม่พบบล็อกที่เล็งอยู่" };

  const container = block.getComponent("minecraft:inventory")?.container;
  if (!container) return { ok: false, msg: "§cบล็อกนี้ไม่มีช่องเก็บของ" };

  const size = container.size;
  const sortMode = normalizeMode(mode);

  const items = Array.from({ length: size }, (_, i) => container.getItem(i));

  if (!isInventorySortedAndMerged(items, size, sortMode)) {
    const merged = sortAndMergeItems(items, size).sort((a, b) => compareItemsByMode(a, b, sortMode));
    writeContainerDiff(container, merged);
  }

  const blockName = formatBlockName(block.typeId);
  const itemCount = items.filter(Boolean).length;
  const emptySlots = size - itemCount;

  return {
    ok: true,
    msg: `§e[${blockName}]§r เรียงสำเร็จ §7มี §f${itemCount}§7 ไอเท็ม / §f${emptySlots}§7 ช่องว่าง / §f${size}§7 ช่องทั้งหมด (!c ${sortMode})`,
  };
}
