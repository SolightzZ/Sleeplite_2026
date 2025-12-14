const history = new Map();

export function getcount(playerid, foodname) {
  if (!history.has(playerid)) return 0;

  const data = history.get(playerid);
  return data[foodname] || 0;
}

export function add(playerid, foodname) {
  let data = history.get(playerid);

  if (!data) {
    data = {};
    history.set(playerid, data);
  }

  const current = data[foodname] || 0;
  data[foodname] = current + 1;

  return data[foodname];
}

export function clear(playerid) {
  history.delete(playerid);
}

export function resetall() {
  history.clear();
}
