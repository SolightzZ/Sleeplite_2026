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

export function showFullBrightMenu(player) {
  const isEnabled = isFullBrightEnabled(player);

  const form = new ActionFormData()
    .title(MENU_TITLE)
    .button(isEnabled ? BUTTON_TEXT_ENABLED : BUTTON_TEXT_DISABLED, isEnabled ? ICON_ENABLED : ICON_DISABLED);

  form
    .show(player)
    .then((response) => {
      if (response.canceled || response.selection !== 0) return;

      const newState = !isEnabled;
      const result = setFullBrightState(player, newState);

      if (result !== undefined) {
        const msg = result ? createEnabledMessage(player.name) : createDisabledMessage(player.name);
        player.onScreenDisplay.setActionBar(msg);
      }
    })
    .catch((err) => {
      console.warn(`[FullBright] Menu error for ${player.name}: ${err}`);
    });
}

export function FullBrightItemUse({ source: player }) {
  showFullBrightMenu(player);
}
