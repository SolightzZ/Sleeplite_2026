import { system } from "@minecraft/server";

export function onGravestoneInteract(event) {
  const { target, player } = event;
  if (!player || !target) return;
  if (target.typeId !== "true:gravestone_storage") return;

  system.runTimeout(() => {
    try {
      target.kill();
    } catch (e) {
      console.warn("[Gravestone] Failed" + e);
    }
  }, 2);
}
console.warn("Gravestone Interact loaded successfully");
