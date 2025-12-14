export const data = {
  users: new Set(),
  timer: null,
};

// เพิ่มคนใช้
export function addUser(userId) {
  data.users.add(userId);
}

// ลบคนใช้
export function removeUser(userId) {
  data.users.delete(userId);
}

// เช็คว่ามีคนใช้ไหม
export function hasUser(userId) {
  return data.users.has(userId);
}

// นับจำนวนคนใช้
export function countUser() {
  return data.users.size;
}

// เก็บ Timer
export function setTimer(id) {
  data.timer = id;
}

// ลบ Timer
export function clearTimer() {
  data.timer = null;
}

// เช็คว่า Timer ทำงานอยู่ไหม
export function hasTimer() {
  return data.timer !== null;
}

// ดึง Timer ID
export function getTimer() {
  return data.timer;
}

// ดึงรายการ ID ทั้งหมด
export function getAllUsers() {
  return Array.from(data.users);
}
