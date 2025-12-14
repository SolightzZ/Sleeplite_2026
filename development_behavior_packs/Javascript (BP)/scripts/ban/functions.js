import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import { world } from "@minecraft/server";
import { getBannedPlayersData, saveBannedPlayersData } from "./database.js";
import { MINIMUM_PLAYERS_REQUIRED_FOR_BAN, BAN_NOTIFICATION_MESSAGE } from "./constants.js";

function getAllPlayersExcept(player) {
  return Array.from(world.getPlayers()).filter((p) => p !== player);
}

async function displayForm(player, { title, type, items, onSelect }) {
  try {
    const form = type === "action" ? new ActionFormData().title(title) : new ModalFormData().title(title);

    if (type === "action" && form instanceof ActionFormData) {
      items.forEach(([name, icon]) => form.button(name, icon || ""));
    } else if (type === "dropdown" && form instanceof ModalFormData) {
      form.dropdown("เลือกผู้เล่น", items);
    } else if (typeof items === "function") {
      items(form);
    }

    const response = await form.show(player);
    if (!response.canceled) onSelect(response);
  } catch (error) {
    console.warn(`[displayForm] UI Error (${title}):`, error);
    player.sendMessage("§cเกิดข้อผิดพลาดในฟอร์ม");
  }
}

async function displayConfirmation(player, message, onConfirm) {
  await displayForm(player, {
    title: "ยืนยัน",
    type: "action",
    items: [
      ["ยืนยัน", "textures/ui/confirm"],
      ["ยกเลิก", "textures/ui/cancel"],
    ],
    onSelect: (response) => {
      if (response.selection === 0) {
        onConfirm();
      } else {
        player.sendMessage("§cยกเลิกแล้ว");
      }
    },
  });
}

async function banPlayer(adminPlayer) {
  const otherPlayers = getAllPlayersExcept(adminPlayer);
  if (otherPlayers.length < MINIMUM_PLAYERS_REQUIRED_FOR_BAN - 1) {
    return adminPlayer.sendMessage(`§cต้องมีผู้เล่นมากกว่า ${MINIMUM_PLAYERS_REQUIRED_FOR_BAN - 1} คน!`);
  }

  await displayForm(adminPlayer, {
    title: "เลือกผู้เล่นที่จะแบน",
    type: "action",
    items: otherPlayers.map((p) => [p.name]),
    onSelect: ({ selection }) => {
      const targetPlayer = otherPlayers[selection];
      displayConfirmation(adminPlayer, `แบน ${targetPlayer.name} ถาวร`, () => {
        const banData = getBannedPlayersData();
        banData.set(targetPlayer.name, {
          reason: "hack",
          by: adminPlayer.name,
          date: new Date().toISOString(),
        });
        saveBannedPlayersData(banData);
        targetPlayer.runCommand(`kick "${targetPlayer.name}" "${BAN_NOTIFICATION_MESSAGE(targetPlayer.name)}"`);
        world.sendMessage(`§c${targetPlayer.name} ถูกแบนโดย ${adminPlayer.name}`);
      });
    },
  });
}

async function unbanPlayer(adminPlayer) {
  const banData = getBannedPlayersData();
  const bannedPlayers = Array.from(banData.keys()).filter((name) => banData.get(name).reason === "hack");

  if (!bannedPlayers.length) {
    return adminPlayer.sendMessage("§cไม่มีผู้เล่นที่ถูกแบนอยู่ในระบบ");
  }

  await displayForm(adminPlayer, {
    title: "เลือกผู้เล่นที่จะปลดแบน",
    type: "dropdown",
    items: bannedPlayers,
    onSelect: ({ formValues }) => {
      const playerName = bannedPlayers[formValues[0]];
      if (!banData.has(playerName)) return;

      banData.delete(playerName);
      saveBannedPlayersData(banData);
      const player = Array.from(world.getPlayers()).find((p) => p.name === playerName);
      if (player) player.setGameMode(GameMode.Survival);
      world.sendMessage(`§a${playerName} ถูกปลดแบนโดย ${adminPlayer.name}`);
    },
  });
}

async function viewInventory(adminPlayer) {
  const otherPlayers = getAllPlayersExcept(adminPlayer);
  if (!otherPlayers.length) return adminPlayer.sendMessage("§cไม่มีผู้เล่นออนไลน์อื่น");

  await displayForm(adminPlayer, {
    title: "เลือกผู้เล่น",
    type: "dropdown",
    items: otherPlayers.map((p) => p.name),
    onSelect: async ({ formValues }) => {
      const targetPlayer = otherPlayers[formValues[0]];
      const container = targetPlayer.getComponent("minecraft:inventory")?.container;
      if (!container) return adminPlayer.sendMessage("§cไม่สามารถเข้าถึง Inventory ของผู้เล่นได้");

      const slotMap = new Map();
      const form = new ModalFormData().title(`Inventory ของ ${targetPlayer.name}`);
      let toggleIndex = 0;

      for (let slot = 0; slot < container.size; slot++) {
        const item = container.getItem(slot);
        if (item) {
          form.toggle(`§7Slot ${slot}: §f${item.typeId} §hx${item.amount}`, { defaultValue: false });
          slotMap.set(toggleIndex++, slot);
        }
      }

      if (!slotMap.size) return adminPlayer.sendMessage("§cผู้เล่นนี้ไม่มีไอเท็มใน Inventory");

      const response = await form.show(adminPlayer);
      if (response.canceled) return;

      const selectedSlots = response.formValues.map((checked, index) => (checked ? slotMap.get(index) : null)).filter((v) => v !== null);

      if (!selectedSlots.length) return adminPlayer.sendMessage("§cคุณไม่ได้เลือกไอเท็มใด ๆ");

      await displayConfirmation(adminPlayer, `ลบของจาก ${targetPlayer.name}`, () => {
        const removedItems = [];

        selectedSlots.forEach((slot) => {
          const item = container.getItem(slot);
          if (item) removedItems.push(`[x] ${item.typeId} x${item.amount}`);
          container.setItem(slot, undefined);
        });

        const removedList = removedItems.length ? removedItems.join("\n") : "ไม่มีไอเท็ม";
        adminPlayer.sendMessage(`§aลบของจาก ${targetPlayer.name} เรียบร้อย \n§f${removedList}`);
      });
    },
  });
}

function getMapAsJson(map, mapName = "Map") {
  if (!(map instanceof Map)) {
    return `§c[Debug] ${mapName} Not a Map!`;
  }
  if (map.size === 0) {
    return `§e[Debug] ${mapName} null`;
  }

  const jsonObj = Object.fromEntries(map);
  const jsonString = JSON.stringify(jsonObj, null, 2);
  return `§a[Debug] ${mapName}:\n§f${jsonString}`;
}

export { getAllPlayersExcept, displayForm, displayConfirmation, banPlayer, unbanPlayer, viewInventory, getMapAsJson };
