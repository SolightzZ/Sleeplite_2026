import { ActionFormData } from "@minecraft/server-ui";
import { CONFIG } from "./constants";
import { EMOTE_DB } from "./database";

const executeEmote = (player, animationId, label) => {
  if (!player) return;

  const command = `playanimation @s animation.${animationId} animation.${animationId}`;

  try {
    player.runCommand(command);
    if (player.onScreenDisplay) {
      player.onScreenDisplay.setActionBar(`Emote: §{label}`);
    }
    if (CONFIG.SOUND_CLICK) {
      player.playSound(CONFIG.SOUND_CLICK);
    }
  } catch (error) {
    console.warn(`[RunCommand Error] ${error}`);
  }
};

const openSubMenu = (player, categoryData) => {
  const form = new ActionFormData().title(categoryData.title || "Emotes").body("§7เลือกท่าทาง:");

  const emotes = categoryData.data;
  for (const emote of emotes) {
    form.button(emote.label, emote.icon || CONFIG.DEFAULT_ICON);
  }

  form.show(player).then((response) => {
    if (response.canceled || response.selection === undefined) return;

    const selectedEmote = emotes[response.selection];
    if (selectedEmote) {
      executeEmote(player, selectedEmote.anim, selectedEmote.label);
    }
  });
};

export const showMainMenu = (player) => {
  const menu = new ActionFormData();
  menu.title("Emote Menu");

  for (const category of EMOTE_DB) {
    menu.button(category.label, category.icon || CONFIG.DEFAULT_ICON);
  }

  player.playSound(CONFIG.SOUND_OPEN || "note.hat");

  menu.show(player).then((response) => {
    if (response.canceled || response.selection === undefined) return;

    const selectedCategory = EMOTE_DB[response.selection];

    if (selectedCategory.type === "ACTION") {
      executeEmote(player, selectedCategory.data, "STOPPED");
    } else {
      openSubMenu(player, selectedCategory);
    }
  });
};
