import { world, system } from "@minecraft/server";

const sendMessagePair = (sender, target, message) => {
  const senderName = sender.name;
  const targetName = target.name;
  const formattedMessage = `§7§l\u00BB§r §7${message}`;
  target.sendMessage(`§ePrivate ${senderName} ${formattedMessage}`);
  sender.sendMessage(`§ePrivate ${targetName} ${formattedMessage}`);
};

export function privates(event) {
  const { sender: player, message: rawMessage } = event;
  const trimmedMessage = rawMessage.trim();

  if (!trimmedMessage.startsWith("!m")) return;
  event.cancel = true;

  system.run(() => {
    try {
      const args = trimmedMessage.split(/\s+/);
      if (args.length < 3) {
        player.sendMessage("§c [?] วิธีใช้: §7!m <@ชื่อผู้เล่น> <ข้อความ>");
        return;
      }

      const targetArg = args[1];
      if (!targetArg.startsWith("@")) {
        player.sendMessage("§c[x] §7กรุณาใส่ @ หน้าชื่อผู้เล่น เช่น !m @Steve Hello!");
        return;
      }

      const targetNameLower = targetArg.slice(1).toLowerCase();
      const content = args.slice(2).join(" ");
      const playerNameLower = player.name.toLowerCase();

      if (playerNameLower === targetNameLower) {
        player.sendMessage("§c[x] คุณไม่สามารถส่งข้อความถึงตัวเองได้!");
        return;
      }

      let targetPlayer = null;
      for (const q of world.getPlayers()) {
        if (q.name.toLowerCase() === targetNameLower) {
          targetPlayer = q;
          break;
        }
      }

      if (targetPlayer) {
        sendMessagePair(player, targetPlayer, content);
      } else {
        player.sendMessage(`§c[x] ไม่พบผู้เล่นชื่อ ${targetNameLower}`);
      }
    } catch (e) {
      player.sendMessage("§c[x] เกิดข้อผิดพลาดในการส่งข้อความ");
      console.warn("Error in private message system:" + e);
    }
  });
}
