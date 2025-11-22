import { ActionFormData } from "@minecraft/server-ui";
import { EMOTE_CATEGORIES, DEFAULT_ICON, STOP_ANIMATION } from "./constants.js";

const playAnimation = (player, animationId, emoteLabel) => {
  const command = `playanimation @s animation.${animationId} animation.${animationId}`;
  try {
    player.runCommand(command);
    player.onScreenDisplay.setActionBar(`Emote: ${emoteLabel}`);
  } catch (e) {
    console.error(`[Emote] Failed to play animation for ${player.name}: ${e}`);
  }
};

const createEmoteMenu = (player, emotes, title) => {
  if (!player || !emotes || emotes.length === 0) return;

  const form = new ActionFormData().title(`§g§r ${title}`);

  for (const emote of emotes) {
    const icon = emote.icon || DEFAULT_ICON;
    form.button(emote.label, icon);
  }

  form.show(player).then((response) => {
    if (!response.canceled && response.selection !== undefined) {
      const selectedEmote = emotes[response.selection];
      playAnimation(player, selectedEmote.animation, selectedEmote.label);
    }
  });
};

export const showMainMenu = (player) => {
  const menu = new ActionFormData().title("Emote Menu");
  for (const category of EMOTE_CATEGORIES) {
    menu.button(category.label, category.icon);
  }

  player.playSound("note.hat");
  menu.show(player).then((response) => {
    if (!response.canceled && response.selection !== undefined) {
      const selection = response.selection;
      const category = EMOTE_CATEGORIES[selection];

      if (category.label === "[STOP]") {
        playAnimation(player, STOP_ANIMATION, "STOP");
      } else {
        createEmoteMenu(player, category.data, category.title);
      }
    }
  });
};
