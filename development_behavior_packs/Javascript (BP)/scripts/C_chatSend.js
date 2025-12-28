import { privates } from "./Others/privateMessage";
import { help_main } from "./Others/help";
import { inv_main } from "./Inventory_Sorter/system";
import { xz_main } from "./Others/nether";
import { RewardchatSend } from "./Reward/system";
import { ZoneProtection_OnChat } from "./Protection/system";
import { chatSendHandler } from "./ban/system";

const CHAT_HANDLERS = [privates, help_main, inv_main, xz_main, RewardchatSend, ZoneProtection_OnChat, chatSendHandler];

export function onChatMessage(event) {
  const sender = event.sender;
  if (!sender) return;

  CHAT_HANDLERS.forEach((handler) => handler(event));
}
console.warn("[world beforeEvents chatSend] loaded successfully");
