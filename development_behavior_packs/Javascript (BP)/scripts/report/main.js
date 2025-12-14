import { world, system } from "@minecraft/server";
import { ActionFormData, ModalFormData, MessageFormData } from "@minecraft/server-ui";
import { config } from "../Reward/constants";

const CONFIG = {
  maxReports: 10,
  tool: "minecraft:paper",
  dbKey: "server_reports_data",
  adminTag: "admin",
};

const isAdmin = (player) => player.hasTag(CONFIG.adminTag);

const getTime = () => {
  try {
    return new Date().toLocaleString("th-TH", {
      timeZone: "Asia/Bangkok",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (e) {
    return new Date().toLocaleString;
  }
};

class Database {
  static load() {
    try {
      const data = world.getDynamicProperty(CONFIG.dbKey);
      if (!data) return {};
      return JSON.parse(data);
    } catch (e) {
      console.warn("[DB Load Error]: " + e);
      return {};
    }
  }

  static save(data) {
    try {
      world.setDynamicProperty(CONFIG.dbKey, JSON.stringify(data));
    } catch (e) {
      console.warn("[DB Save Error]: " + e);
    }
  }

  static add(name, title, body) {
    try {
      const db = this.load();
      if (!db[name]) db[name] = [];
      db[name].push({ t: title, b: body, d: getTime(), r: "" });
      this.save(db);
    } catch (e) {
      console.warn("[DB Add Error]: " + e);
    }
  }

  static update(name, index, title, body) {
    try {
      const db = this.load();
      if (db[name] && db[name][index]) {
        db[name][index].t = title;
        db[name][index].b = body;
        db[name][index].d = getTime() + " (edit)";
        this.save(db);
      }
    } catch (e) {
      console.warn("[DB Update Error]: " + e);
    }
  }

  static delete(name, index) {
    try {
      const db = this.load();
      if (db[name]) {
        db[name].splice(index, 1);
        if (db[name].length === 0) delete db[name];
        this.save(db);
      }
    } catch (e) {
      console.warn("[DB Delete Error]: " + e);
    }
  }

  static reply(name, index, text) {
    try {
      const db = this.load();
      if (db[name] && db[name][index]) {
        db[name][index].r = text;
        this.save(db);
      }
    } catch (e) {
      console.warn("[DB Reply Error]: " + e);
    }
  }

  static get(name) {
    try {
      const db = this.load();
      return db[name] || [];
    } catch (e) {
      console.warn("[DB Get Error]: " + e);
      return [];
    }
  }

  static getAll() {
    return this.load();
  }
}

const sure = (player, onConfirm, onCancel) => {
  try {
    const ui = new MessageFormData();
    ui.title("ยืนยันการลบข้อมูล");
    ui.body("ท่านแน่ใจหรือไม่ที่จะลบรายการนี้? การกระทำนี้ไม่สามารถยกเลิกได้");
    ui.button1("Confirm (ยืนยัน)");
    ui.button2("Cancel (ยกเลิก)");

    ui.show(player).then((res) => {
      if (res.canceled) {
        if (onCancel) onCancel();
        return;
      }
      if (res.selection === 0) onConfirm();
      else if (onCancel) onCancel();
    });
  } catch (e) {
    console.warn("System Error (Sure): " + e);
  }
};

const note = (player) => {
  try {
    const ui = new ActionFormData();
    ui.title("บันทึกการอัปเดตระบบ");
    ui.body(
      "§6[ รายละเอียดระบบเสริมและคุณสมบัติ ]§r\n" +
        "§7รายการระบบเสริมและฟีเจอร์ใหม่ที่เพิ่มเข้ามาเพื่อยกระดับประสบการณ์การใช้งาน\n\n" +
        "§31. เครื่องมือและระบบอำนวยความสะดวก§r\n" +
        "- §fMagnet:§7 ระบบแม่เหล็กเก็บไอเทมรอบตัวอัตโนมัติ\n" +
        "- §fProtection:§7 ระบบกำหนดเขตแดนและพื้นที่ส่วนตัว\n" +
        "- §fFull Bright:§7 ปรับระดับการมองเห็นให้สว่างสูงสุด\n" +
        "- §fLight Blocks:§7 บล็อกกำเนิดแสงสำหรับโหมดเอาชีวิตรอด\n" +
        "- §fInventory Sorter:§7 ระบบจัดเรียงไอเทมในกระเป๋าอัตโนมัติ\n" +
        "- §fChest Sorter:§7 ระบบจัดเรียงไอเทมในกล่องเก็บของอัตโนมัติ\n" +
        "- §fFood Stats:§7 แสดงค่าสถานะความอิ่มและคุณค่าทางอาหาร\n" +
        "- §fDoor Air:§7 ประตูสามารถใช้หายใจใต้น้ำได้\n" +
        "- §fEnd Portal Frame:§7 สามารถขุดดวงตาเอนเดอร์ได้ (มีเงื่อนไข)\n" +
        "- §fFree Camera:§7 โหมดกล้องอิสระสำหรับบันทึกภาพ\n" +
        "- §fJava Saturation:§7 ระบบฟื้นฟูพลังชีวิตจากอาหารแบบ Java\n" +
        "- §fDurability & Name:§7 แสดงความทนทานและชื่อไอเทม\n" +
        "- §fQuickServer:§7 ระบบย้ายเซิร์ฟเวอร์แบบเร่งด่วน\n" +
        "- §fHUB Setting:§7 เมนูตั้งค่าส่วนตัวสำหรับผู้เล่น\n" +
        "- §fPrivate Message:§7 ระบบข้อความส่วนตัวระหว่างผู้เล่น\n" +
        "- §fReward:§7 ระบบรางวัลประจำวันและการเข้าสู่ระบบ\n" +
        "- §fEconomy:§7 ระบบธนาคารและเศรษฐกิจภายในเกม\n" +
        "- §fWolf Tools:§7 อุปกรณ์หมาป่า (จอบเก็บระยะไกล / พลั่วขุดพื้นที่กว้าง)\n\n" +
        "§32. การแสดงผลหน้าจอและท่าทาง§r\n" +
        "- §fDay Counter:§7 ตัวนับจำนวนวันภายในเกม\n" +
        "- §fBiome Title:§7 แสดงชื่อสภาพแวดล้อมเมื่อเข้าสู่พื้นที่\n" +
        "- §fDaily Food Limit:§7 ระบบจำกัดปริมาณอาหารต่อวัน\n" +
        "- §fHelp Command:§7 คำสั่งช่วยเหลือผู้เล่น (!help)\n" +
        "- §fThirst:§7 ระบบความกระหายน้ำ\n" +
        "- §fBoss Title:§7 แถบชื่อบอสรูปแบบเคลื่อนไหว\n" +
        "- §fEmotes:§7 ระบบท่าทางและการแสดงอารมณ์\n" +
        "- §fPatch Note:§7 สมุดบันทึกรายละเอียดการอัปเดต\n" +
        "- §fWelcome UI:§7 หน้าจอประกาศต้อนรับผู้ใช้งาน\n" +
        "- §fDimensions Locked:§7 ระบบล็อคมิติ The End แบบมีเงื่อนไข\n" +
        "- §fHotbar Sound:§7 เสียงเลื่อนช่องเก็บของรูปแบบ Java\n\n" +
        "§33. อุปกรณ์สวมใส่และเครื่องมือ§r\n" +
        "- §fWolf Set:§7 ชุดเกราะและเครื่องมือธีมหมาป่า\n" +
        "- §fDemon Set:§7 ชุดเกราะและดาบระดับสูง (ชุดปีศาจ)\n\n" +
        "§34. ระบบจัดการการเสียชีวิต§r\n" +
        "- §fGravestones:§7 หลุมศพเก็บไอเทมป้องกันการสูญหาย\n" +
        "- §fDeath Location:§7 แจ้งพิกัดการเสียชีวิตในช่องสนทนา\n" +
        "- §fPlayer Heads:§7 ดรอปศีรษะผู้เล่นเมื่อเสียชีวิต\n\n" +
        "§35. เครื่องมือสำหรับผู้ดูแลระบบ§r\n" +
        "- §fBan System:§7 ระบบระงับและยกเลิกการระงับผู้ใช้งาน\n" +
        "- §fView Inventory:§7 ตรวจสอบช่องเก็บของภายในตัวผู้เล่น\n\n" +
        "§36. การสร้างและสูตรไอเทม§r\n" +
        "- §fCustom Crafting:§7 สูตรการสร้างไอเทมรูปแบบพิเศษ\n" +
        "- §fAdvanced Crafting:§7 โต๊ะสร้างไอเทมขั้นสูง\n" +
        "- §fNew Recipes:§7 เพิ่มสูตรไอเทมใหม่และสูตรตัดหิน\n" +
        "- §fDecorations:§7 ภาพวาดและถังเก็บของลวดลายพิเศษ\n\n" +
        "§37. การปรับปรุงสิ่งมีชีวิต§r\n" +
        "- §fGiant Mobs:§7 เพิ่มขนาดของปลาและมอนสเตอร์บางชนิด\n" +
        "- §fRideable:§7 สัตว์พาหนะรองรับผู้โดยสาร 2 ที่นั่ง\n" +
        "- §fEnder Dragon:§7 ปรับปรุงระดับความยากและขนาด\n" +
        "- §fHappy Ghast:§7 แกสต์พาหนะ (รองรับ 12 ที่นั่ง)\n\n" +
        "§38. ไอเทม สิ่งก่อสร้าง และสภาพแวดล้อม§r\n" +
        "- §fItems:§7 อาหาร เครื่องดื่ม และของใช้ชนิดใหม่หลากหลายรายการ\n" +
        "- §fStructures:§7 สิ่งปลูกสร้างใหม่ตามธรรมชาติ (หอคอย, บ้าน, ดันเจี้ยน)\n" +
        "- §fBiomes:§7 สภาพแวดล้อมใหม่ (ป่าซากุระ, โอเอซิส, หุบเขา, ภูเขาไฟ)"
    );

    ui.button("ย้อนกลับ", "textures/ui/arrow_left");
    ui.show(player).then((res) => {
      if (res.canceled) return;
      if (res.selection === 0) menu(player);
    });
  } catch (e) {
    console.warn("System Error (Note): " + e);
  }
};

const sendform = (player) => {
  try {
    const name = player.name;
    const list = Database.get(name);

    if (list.length >= CONFIG.maxReports) {
      player.sendMessage(`§c[Report] กล่องข้อความเต็มแล้ว (${CONFIG.maxReports}/${CONFIG.maxReports})`);
      reportmenu(player);
      return;
    }

    const ui = new ModalFormData();
    ui.title("แจ้งปัญหา / ข้อเสนอแนะ");
    ui.textField("หัวข้อเรื่อง", "เช่น: ฟาร์มบั๊ก, บล็อกหาย, ของหาย");
    ui.textField("รายละเอียด", "ระบุพิกัด และวิธีทำให้เกิดปัญหา");

    ui.show(player).then((res) => {
      try {
        if (res.canceled) {
          reportmenu(player);
          return;
        }
        const [t, b] = res.formValues;

        if (!t || !b || t.trim() === "" || b.trim() === "") {
          player.sendMessage("§c[Report] กรุณากรอกข้อมูลให้ครบถ้วน");
          system.runTimeout(() => sendform(player), 20);
          return;
        }

        Database.add(name, t, b);
        player.sendMessage("§a[Report] บันทึกข้อมูลเรียบร้อยแล้ว");
        reportmenu(player);
      } catch (innerError) {
        console.warn("Logic Error (SendForm): " + innerError);
        player.sendMessage("§cเกิดข้อผิดพลาดในการบันทึกข้อมูล");
        reportmenu(player);
      }
    });
  } catch (e) {
    console.warn("System Error (SendForm): " + e);
    reportmenu(player);
  }
};

const mylist = (player, mode) => {
  try {
    const name = player.name;
    const list = Database.get(name);

    if (list.length === 0) {
      player.sendMessage("§c[Report] ไม่พบข้อมูลในระบบ");
      reportmenu(player);
      return;
    }

    const ui = new ActionFormData();
    ui.title(mode === "edit" ? "เลือกรายการเพื่อแก้ไข" : "เลือกรายการเพื่อลบ");
    ui.body("รายการข้อความของท่าน");

    list.forEach((item, i) => {
      ui.button(`${i + 1}. ${item.t}`);
    });

    ui.button("ย้อนกลับ", "textures/ui/arrow_left");

    ui.show(player).then((res) => {
      if (res.canceled) return;
      if (res.selection === list.length) {
        reportmenu(player);
        return;
      }

      const idx = res.selection;

      if (mode === "edit") {
        const f = new ModalFormData();
        f.title("แก้ไขรายงาน");
        f.textField("หัวข้อเรื่อง", "", { defaultValue: list[idx].t });
        f.textField("รายละเอียด", "", { defaultValue: list[idx].b });

        f.show(player).then((r) => {
          try {
            if (r.canceled) {
              mylist(player, mode);
              return;
            }
            const [nt, nb] = r.formValues;
            Database.update(name, idx, nt, nb);
            player.sendMessage("§e[Report] แก้ไขข้อมูลสำเร็จ");
            mylist(player, mode);
          } catch (e) {
            console.warn("Update Error: " + e);
            mylist(player, mode);
          }
        });
      } else {
        sure(
          player,
          () => {
            Database.delete(name, idx);
            player.sendMessage("§c[Report] ลบข้อมูลสำเร็จ");
            mylist(player, mode);
          },
          () => mylist(player, mode)
        );
      }
    });
  } catch (e) {
    console.warn("System Error (MyList): " + e);
    reportmenu(player);
  }
};

const reportmenu = (player) => {
  try {
    const ui = new ActionFormData();
    ui.title("เมนูรายงาน (Report)");
    ui.body("กรุณาเลือกรายการที่ต้องการ");

    ui.button("ส่งข้อความ");
    ui.button("แก้ไขข้อความ");
    ui.button("ลบข้อความ");
    ui.button("ย้อนกลับ", "textures/ui/arrow_left");

    ui.show(player).then((res) => {
      if (res.canceled) return;
      if (res.selection === 0) sendform(player);
      if (res.selection === 1) mylist(player, "edit");
      if (res.selection === 2) mylist(player, "del");
      if (res.selection === 3) menu(player);
    });
  } catch (e) {
    console.warn("System Error (ReportMenu): " + e);
    menu(player);
  }
};

const inbox = (player) => {
  try {
    const name = player.name;
    const list = Database.get(name);
    const replied = list.filter((item) => item.r !== "");

    if (replied.length === 0) {
      const ui = new ActionFormData();
      ui.title("กล่องจดหมาย (Inbox)");
      ui.body("§7[Report] ยังไม่มีการตอบกลับจากผู้ดูแลระบบ");
      ui.button("ย้อนกลับ", "textures/ui/arrow_left");
      ui.show(player).then(() => menu(player));
      return;
    }

    const ui = new ActionFormData();
    ui.title("กล่องจดหมาย (Inbox)");
    ui.body("รายการที่ได้รับการตอบกลับแล้ว");

    replied.forEach((item) => {
      ui.button(`อ่าน: ${item.t}`);
    });

    ui.button("ย้อนกลับ", "textures/ui/arrow_left");

    ui.show(player).then((res) => {
      if (res.canceled) return;
      if (res.selection === replied.length) {
        menu(player);
        return;
      }

      const item = replied[res.selection];
      const show = new MessageFormData();
      show.title("รายละเอียดการตอบกลับ");
      show.body(`หัวข้อ: ${item.t}\nคำถาม: ${item.b}\n\n§eตอบกลับ: ${item.r}`);
      show.button1("ย้อนกลับ");
      show.button2("ปิดหน้าต่าง");

      show.show(player).then((r) => {
        if (r.selection === 0) inbox(player);
      });
    });
  } catch (e) {
    console.warn("System Error (Inbox): " + e);
    menu(player);
  }
};

const adminact = (player, targetName, index) => {
  try {
    const list = Database.get(targetName);

    if (!list || !list[index]) {
      player.sendMessage("§c[Report] ข้อมูลถูกเปลี่ยนแปลงหรือลบแล้ว");
      adminmsg(player, targetName);
      return;
    }
    const item = list[index];
    const ui = new ActionFormData();

    ui.title("จัดการข้อความ");
    ui.body(`ผู้ส่ง: ${targetName}\nหัวข้อ: ${item.t}`);

    ui.button("อ่านรายละเอียด");
    ui.button("ตอบกลับ (Reply)");
    ui.button("ดู JSON (Console)");
    ui.button("ลบทิ้ง (Delete)");
    ui.button("ย้อนกลับ", "textures/ui/arrow_left");

    ui.show(player).then((res) => {
      if (res.canceled) return;

      if (res.selection === 0) {
        const f = new ModalFormData();
        f.title("รายละเอียดรายงาน");
        f.textField("ผู้ส่ง", "", { defaultValue: targetName });
        f.textField("เวลา", "", { defaultValue: item.d });
        f.textField("หัวข้อ", "", { defaultValue: item.t });
        f.textField("เนื้อหา", "", { defaultValue: item.b });
        if (item.r) f.textField("§aคำตอบเดิม", "", { defaultValue: item.r });
        f.show(player).then(() => adminact(player, targetName, index));
      } else if (res.selection === 1) {
        const f = new ModalFormData();
        f.title("ตอบกลับผู้ใช้งาน");
        f.textField("ข้อความตอบกลับ", "", { defaultValue: item.r });

        f.show(player).then((r) => {
          if (r.canceled) {
            adminact(player, targetName, index);
            return;
          }
          Database.reply(targetName, index, r.formValues[0]);
          player.sendMessage("§a[Report] บันทึกการตอบกลับสำเร็จ");
          adminact(player, targetName, index);
        });
      } else if (res.selection === 2) {
        console.warn(JSON.stringify(item, null, 2));
        adminact(player, targetName, index);
      } else if (res.selection === 3) {
        sure(
          player,
          () => {
            Database.delete(targetName, index);
            player.sendMessage("§c[Report] ลบข้อมูลสำเร็จ");
            adminmsg(player, targetName);
          },
          () => adminact(player, targetName, index)
        );
      } else {
        adminmsg(player, targetName);
      }
    });
  } catch (e) {
    console.warn("System Error (AdminAct): " + e);
    adminmsg(player, targetName);
  }
};

const adminmsg = (player, targetName) => {
  try {
    const list = Database.get(targetName);
    if (!list || list.length === 0) {
      adminpanel(player);
      return;
    }

    const ui = new ActionFormData();
    ui.title(`ข้อความจาก ${targetName}`);

    list.forEach((item) => {
      const status = item.r ? "[ตอบแล้ว]" : "[รอ]";
      ui.button(`${status} ${item.t}`);
    });

    ui.button("ย้อนกลับ", "textures/ui/arrow_left");
    ui.show(player).then((res) => {
      if (res.canceled) return;
      if (res.selection === list.length) {
        adminpanel(player);
        return;
      }
      adminact(player, targetName, res.selection);
    });
  } catch (e) {
    console.warn("System Error (AdminMsg): " + e);
    adminpanel(player);
  }
};

const adminpanel = (player) => {
  try {
    const db = Database.getAll();
    const names = Object.keys(db);

    const ui = new ActionFormData();
    ui.title("แผงควบคุมผู้ดูแล (Admin Panel)");
    ui.body(`มีผู้แจ้งปัญหาทั้งหมด ${names.length} คน`);

    ui.button("Dump (Console)");

    names.forEach((n) => {
      ui.button(`${n} (${db[n].length})`);
    });

    ui.button("ย้อนกลับ", "textures/ui/arrow_left");

    ui.show(player).then((res) => {
      if (res.canceled) return;

      if (res.selection === 0) {
        console.warn("***** Server Dump *****");
        console.warn(JSON.stringify(db, null, 2));
        player.sendMessage("§e[System] Dump ข้อมูลลง Console แล้ว");
        adminpanel(player);
      } else if (res.selection === names.length + 1) {
        menu(player);
      } else {
        const realIndex = res.selection - 1;
        if (realIndex >= 0) adminmsg(player, names[realIndex]);
      }
    });
  } catch (e) {
    console.warn("System Error (AdminPanel): " + e);
    menu(player);
  }
};

const menu = (player) => {
  try {
    const ui = new ActionFormData();
    ui.title("เมนูหลัก (Main Menu)");
    ui.body("แจ้งปัญหาต่างได้ที่นี้เลย!!");

    ui.button("บันทึกการอัปเดต (Patch Note)");
    ui.button("แจ้งปัญหา (Report)");
    ui.button("กล่องตอบกลับ (Inbox)");

    if (isAdmin(player)) {
      ui.button("แผงควบคุม (Admin)");
    }

    ui.show(player).then((res) => {
      if (res.canceled) return;
      if (res.selection === 0) note(player);
      if (res.selection === 1) reportmenu(player);
      if (res.selection === 2) inbox(player);
      if (res.selection === 3 && isAdmin(player)) adminpanel(player);
    });
  } catch (e) {
    console.warn("System Error (Menu): " + e);
  }
};

export function RUNREPORT(event) {
  try {
    const player = event.source;
    system.run(() => {
      menu(player);
    });
  } catch (err) {
    console.warn("Event Error: " + err);
  }
}

console.warn("Report and Patch Note loaded successfully");
