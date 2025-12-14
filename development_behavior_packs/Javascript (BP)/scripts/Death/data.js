import { people } from "./config.js";

export function getItem(name) {
  return people[name] || null;
}
