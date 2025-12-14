import { ItemStack } from "@minecraft/server";
import { SORTING_MODES } from "./constants.js";

export function normalizeMode(mode) {
  const m = (mode ?? "type").toLowerCase();
  return SORTING_MODES[m] ?? "type";
}

export function compareItemsByMode(a, b, mode) {
  if (!a && !b) return 0;
  if (!a) return 1;
  if (!b) return -1;

  if (mode === "amount_asc" || mode === "amount_desc") {
    if (a.amount === b.amount) {
      return a.typeId < b.typeId ? -1 : 1;
    }
    return mode === "amount_desc" ? (a.amount < b.amount ? 1 : -1) : a.amount > b.amount ? 1 : -1;
  }

  if (a.typeId === b.typeId) {
    if (a.amount === b.amount) return 0;
    return a.amount < b.amount ? 1 : -1;
  }
  return a.typeId < b.typeId ? -1 : 1;
}

export function cloneWithAmountLike(ref, amount) {
  if (typeof ref.clone === "function") {
    const c = ref.clone();
    c.amount = amount;
    return c;
  }
  return new ItemStack(ref.typeId, amount);
}

export function sortAndMergeItems(items, maxSize) {
  try {
    const buckets = new Map();

    for (const it of items) {
      if (!it?.typeId) continue;
      let groups = buckets.get(it.typeId);
      if (!groups) {
        groups = [];
        buckets.set(it.typeId, groups);
      }

      let merged = false;
      for (const g of groups) {
        try {
          if (it.isStackableWith?.(g.ref)) {
            g.total += it.amount;
            merged = true;
            break;
          }
        } catch {}
      }
      if (!merged) groups.push({ ref: it, total: it.amount });
    }

    const out = [];
    for (const groups of buckets.values()) {
      for (const g of groups) {
        const maxAmt = g.ref.maxAmount ?? 64;
        let remain = g.total;
        while (remain > 0 && out.length < maxSize) {
          const take = remain > maxAmt ? maxAmt : remain;
          out.push(cloneWithAmountLike(g.ref, take));
          remain -= take;
        }
      }
    }

    while (out.length < maxSize) out.push(undefined);
    return out;
  } catch (e) {
    console.warn("[sortAndMergeItems] error:", e);
    return items;
  }
}

export function isInventorySortedAndMerged(items, maxSize, mode = "type") {
  try {
    let prev = null;
    let used = 0;

    for (const cur of items) {
      if (!cur) continue;
      used++;

      if (prev && compareItemsByMode(prev, cur, mode) > 0) return false;

      if (prev && prev.typeId === cur.typeId && prev.amount < (prev.maxAmount ?? 64) && cur.isStackableWith?.(prev)) {
        return false;
      }
      prev = cur;
    }
    return used <= maxSize;
  } catch {
    return false;
  }
}

export function writeContainerDiff(container, newItems) {
  const size = Math.min(container.size, newItems.length);
  for (let i = 0; i < size; i++) {
    const cur = container.getItem(i);
    const nxt = newItems[i];
    const same = (!cur && !nxt) || (cur && nxt && cur.typeId === nxt.typeId && cur.amount === nxt.amount);
    if (!same) container.setItem(i, nxt);
  }
}

export function formatBlockName(typeId) {
  return (typeId ?? "minecraft:unknown")
    .replace("minecraft:", "")
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
