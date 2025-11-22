import { nss, nsx, SS, GG, PM, DEFAULT_ICON, STOP_ANIMATION } from "./database";

export const EMOTE_CATEGORIES = [
  { label: "Emote Dexten", data: nss, title: "Emote Dexten", icon: "textures/emotes/icon_main_Dexten" },
  { label: "Emote Euforia", data: nsx, title: "Emote Euforia", icon: "textures/emotes/icon_main_Euforia" },
  { label: "Emote Special ", data: SS, title: "Emote Special", icon: "textures/emotes/icon_special" },
  { label: " Emote General", data: GG, title: "Emote General", icon: "textures/emotes/icon_normal" },
  { label: "Emote Post", data: PM, title: "Emote Post", icon: "textures/emotes/icon_post" },
  { label: "[STOP]", data: STOP_ANIMATION, title: null, icon: "textures/emotes/ClearC" },
];

export { DEFAULT_ICON, STOP_ANIMATION };
