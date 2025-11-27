import { ActionFormData } from "@minecraft/server-ui";
import {
  MENU_TITLE,
  BUTTON_TEXT_ENABLED,
  BUTTON_TEXT_DISABLED,
  ICON_ENABLED,
  ICON_DISABLED,
  createEnabledMessage,
  createDisabledMessage,
} from "./constants.js";
import { isFullBrightEnabled, setFullBrightState } from "./database.js";

function buildFormTask(isEnabled) {
  const buttonText = isEnabled ? BUTTON_TEXT_DISABLED : BUTTON_TEXT_ENABLED;
  const iconPath = isEnabled ? ICON_DISABLED : ICON_ENABLED;
  return new ActionFormData().title(MENU_TITLE).button(buttonText, iconPath);
}

function handleResponseTask(player, response, isCurrentlyEnabled) {
  if (response.canceled || response.selection !== 0) return;

  const newState = !isCurrentlyEnabled;
  const result = setFullBrightState(player, newState);

  if (result !== undefined) {
    const messageFunc = result ? createEnabledMessage : createDisabledMessage;
    const msg = messageFunc(player.name);

    player.onScreenDisplay.setActionBar(msg);
  }
}

export function showFullBrightMenu(player) {
  const isEnabled = isFullBrightEnabled(player);
  const form = buildFormTask(isEnabled);
  try {
    form.show(player).then((response) => {
      handleResponseTask(player, response, isEnabled);
    });
  } catch (error) {
    console.warn("ShowFullBrightMenu:", error);
  }
}
