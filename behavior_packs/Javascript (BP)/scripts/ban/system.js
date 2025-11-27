import { system, Player } from "@minecraft/server";
import { ADMIN_ROLE_TAG, BAN_NOTIFICATION_MESSAGE } from "./constants.js";
import { getBannedPlayersData } from "./database.js";
import { displayForm, banPlayer, unbanPlayer, viewInventory, getMapAsJson } from "./functions.js";

async function openAdminMenu(player) {
  if (!player.hasTag(ADMIN_ROLE_TAG)) return player.sendMessage("§cต้องมีแท็ก admin!");

  player.playSound("mob.evocation_illager.cast_spell");
  await displayForm(player, {
    title: "เมนูแอดมิน",
    type: "action",
    items: [
      ["แบนผู้เล่น", "textures/ui/icons/icon_trending.png"],
      ["ปลดแบนผู้เล่น", "textures/ui/icons/icon_new.png"],
      ["ดู Inventory", "textures/ui/icons/icon_mashuphanger.png"],
    ],
    onSelect: ({ selection }) => {
      const actions = [banPlayer, unbanPlayer, viewInventory];
      actions[selection](player);
    },
  });
}

export function mainBanSystem({ source: player }) {
  if (!player.hasTag(ADMIN_ROLE_TAG)) return;
  system.runTimeout(() => openAdminMenu(player), 1);
}

export function checkBanOnSpawn(event) {
  const { player, initialSpawn } = event;

  if (!initialSpawn) return;
  if (!(player instanceof Player)) return;

  const banData = getBannedPlayersData();
  const banInfo = banData.get(player.name);

  if (banInfo && banInfo.reason === "hack") {
    system.runTimeout(() => {
      const kickMessage = BAN_NOTIFICATION_MESSAGE(player.name);
      player.runCommand(`kick "${player.name}" "${kickMessage}"`);
    }, 10);
  }
}

function debugBanCache(player) {
  if (!player.hasTag(ADMIN_ROLE_TAG)) return;

  const banData = getBannedPlayersData();
  console.warn(getMapAsJson(banData, "banPlayerCache"));
}

export function chatSendHandler(event) {
  const player = event.sender;
  const message = event.message;

  if (!player.hasTag(ADMIN_ROLE_TAG)) return;
  if (message === "!banlist") {
    event.cancel = true;
    system.run(() => {
      debugBanCache(player);
    });
  }
}

console.warn("Ban player loaded successfully");
