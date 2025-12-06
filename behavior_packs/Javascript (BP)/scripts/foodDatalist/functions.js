// functions.js
// ส่วนนี้มีหน้าที่จัดการตรรกะการอัปเดต Lore

import { EntityComponentTypes } from "@minecraft/server";
import { makeLore, getFoodData } from "./fooddata.js"; // นำเข้าฟังก์ชันที่จำเป็น

// ฟังก์ชันอัปเดต Lore ใน Item: ถูกแก้ไขให้คืนค่า boolean
function updateItemLore(item, food) {
  // หากไม่มี item หรือ food data ให้ return false
  if (!item || !food) return false;

  // สร้าง Lore ใหม่โดยใช้ฟังก์ชัน makeLore
  const newLore = makeLore(food);

  // ตั้งค่า Lore ให้กับ Item
  item.setLore(newLore);

  return true; // <<< แก้ไข: คืนค่า true เมื่อทำสำเร็จ
}

// ฟังก์ชันหลัก: อัปเดต Lore สำหรับของทั้งหมดในช่องเก็บของผู้เล่น
// เปลี่ยนชื่อเป็น "updatePlayerItems" เพื่อให้สั้นลงและเข้าใจง่ายขึ้น
export function updatePlayerItems(player) {
  try {
    // ใช้ EntityComponentTypes ที่ถูกต้อง (จาก @minecraft/server)
    const invComp = player.getComponent(EntityComponentTypes.Inventory);

    // ตรวจสอบ Inventory
    if (!invComp || !invComp.container) {
      // ตรวจสอบ container ด้วย
      player.sendMessage(`§c[x] ไม่สามารถเข้าถึงช่องเก็บ`);
      return;
    }
    const inv = invComp.container;

    // วนลูปผ่านช่องเก็บของ
    for (let slot = 0; slot < inv.size; slot++) {
      const item = inv.getItem(slot);

      // ข้ามช่องที่ไม่มี Item
      if (!item) continue;

      // ค้นหาข้อมูลอาหารโดยใช้ฟังก์ชันที่นำเข้า
      const food = getFoodData(item.typeId);

      // ข้าม Item ที่ไม่มีข้อมูลอาหาร
      if (!food) continue;

      // อัปเดต Lore และตรวจสอบผลลัพธ์
      if (updateItemLore(item, food)) {
        // ใช้การตรวจสอบที่ถูกต้อง
        // ต้องเรียก setItem กลับเข้าไปในช่องเก็บ (ตาม API)
        inv.setItem(slot, item);
      }
    }
  } catch (error) {
    player.sendMessage(`§c[x] อัปเดต Lore ล้มเหลว`);
    console.warn(`Error updating Lore for ${player.name}: ${error}`);
  }
}

console.warn("Functions loaded");
