import { system } from "@minecraft/server";

import { updateFoodLore } from "../foodDatalist/functions.js";
import { dy } from "./help_Durability.js";
import { getPlayerData } from "../DailyFoodLimit/database.js";

const help = `§8--------- §eHelper §8---------
§7[§a/§7] /server §7Quick Server - เข้าร่วมเซิร์ฟเวอร์อื่นๆ
§7[§a/§7] !xz §7Nether Calculator คำนวณพิกัดเนเทอร์
§7[§a/§7] !m §7Private Message - ส่งข้อความส่วนตัว
§7[§a/§7] !r §7Inventory Sorter - เรียงไอเทมในตัว
§7[§a/§7] !c §7Chest Sorter เรียงไอเทมในกล่อง
§7[§a/§7] !f §7Food Stats - แสดงค่าอาหารต่างๆ
§7[§a/§7] !df §7Player FoodData - แสดงค่าอาหารต่างๆของผู้เล่นที่กิน
§7[§a/§7] !d §7Durability & Player name - แสดงความทนทานไอเทมในตัว และ แสดงแท็กชื่อ
`;

const adminHelp = `§8--------- §cHelper Admin §8---------
§7[§c/§7] !json - แสดงข้อมูล JSON Protection
§7[§c/§7] !reset-login - รีเซ็ตข้อมูล Reward
§7[§c/§7] !json-login - แสดงข้อมูลล็อกอิน JSON Reward
§7[§c/§7] !banlist - แสดงข้อมูลรายชื่อการแบน
`;

export function help_main(event) {
  const { sender: player, message } = event;
  const command = message.trim().toLowerCase();

  if (command === "!help") {
    event.cancel = true;
    player.sendMessage(help);
    if (player.hasTag("admin")) {
      player.sendMessage(adminHelp);
    }
  }
  if (command === "!d") {
    event.cancel = true;
    system.runTimeout(() => dy(player), 20);
  }
  if (command === "!f") {
    event.cancel = true;
    system.runTimeout(() => updateFoodLore(player), 20);
  }
  if (command === "!df") {
    event.cancel = true;
    system.runTimeout(() => getPlayerData(player), 20);
  }
}
