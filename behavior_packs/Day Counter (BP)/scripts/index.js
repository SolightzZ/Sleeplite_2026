import { system, world } from "@minecraft/server";

// กำหนดค่า Dynamic Property เริ่มต้น
if (world.getDynamicProperty("s") === undefined) world.setDynamicProperty("s", false);

// ฟังก์ชันเช็คสถานะ
const c = () => world.getDynamicProperty("s") === true;

// ฟังก์ชันเช็คกลางวัน/กลางคืน
const d = (e) => (e >= 23250 || e < 12541 ? "d" : "n");

// ฟังก์ชันเล่นเสียง
const f = (g) => g.playSound("random.click", { volume: 0.75 });

// ฟังก์ชันแสดง Action Bar
const h = (i, j) => i.onScreenDisplay.setActionBar(j);

// ข้อมูล Animation สำหรับ Action Bar
const k = [
  { n: 3, m: () => "§" },
  { n: 3, m: () => "-" },
  { n: 5, m: () => "--" },
  { n: 5, m: () => "----" },
  { n: 3, m: () => "-- --" },
  { n: 4, m: () => "-- D --" },
  { n: 3, m: () => "-- DA --" },
  { n: 3, m: () => "-- DAY --" },
  { n: 3, m: () => "-- DAY  --" },
  { n: 50, m: (l) => `-- DAY ${l} --` },
  { n: 3, m: () => "-- DAY --" },
  { n: 3, m: () => "-- DA --" },
  { n: 4, m: () => "-- D --" },
  { n: 3, m: () => "--  --" },
  { n: 3, m: () => "-- --" },
  { n: 5, m: () => "--" },
  { n: 5, m: () => "-" },
  { n: 3, m: () => "§" },
];

// ฟังก์ชันแสดง Action Bar แบบอนิเมชัน
function m(n, o) {
  world.setDynamicProperty("s", true);
  let p = world.getDay();
  if (n >= 23250) p += 1;

  let q = 0;

  const r = () => {
    const s = k[q];
    if (!s) return;

    const t = world.getPlayers();
    for (const u of o) {
      if (t.some((v) => v.id === u.id)) {
        try {
          f(u);
          h(u, s.m(p));
        } catch {}
      }
    }

    if (q < k.length - 1) {
      q += 1;
      system.runTimeout(r, s.n);
    }
  };

  r();
}

// ตัวแปรเก็บเวลาเมื่อรอบก่อนหน้า
let lastTime = -1;

function w() {
  const x = world.getTimeOfDay();

  // ถ้าเวลาไม่เปลี่ยน แค่ return เลย
  if (x === lastTime) return;
  lastTime = x;

  const y = d(x);

  if (y === "d" && !c()) {
    m(x, world.getAllPlayers());
  } else if (y === "n") {
    world.setDynamicProperty("s", false);
  }
}

// ตรวจสอบทุก 512 tick
system.runInterval(w, 512);
