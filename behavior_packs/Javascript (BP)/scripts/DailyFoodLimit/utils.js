import { world } from "@minecraft/server";

export const formatItemName = (typeId) => {
  const raw = typeId.includes(":") ? typeId.split(":")[1] : typeId;
  return raw.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
};

export const getCurrentDay = () => {
  return Math.floor(world.getAbsoluteTime() / 24000);
};

export const isFoodRestricted = (foodSet, typeId) => {
  return typeId && foodSet.has(typeId);
};
