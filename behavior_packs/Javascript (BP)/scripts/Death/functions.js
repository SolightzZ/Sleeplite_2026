export const formatDimensionId = (id) =>
  id
    .replace("minecraft:", "")
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

export const floorPosition = (pos) => ({
  x: Math.floor(pos.x),
  y: Math.floor(pos.y),
  z: Math.floor(pos.z),
});
