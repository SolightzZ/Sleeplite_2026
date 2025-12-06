import { world, system, Player } from "@minecraft/server";

const DEATH_OBJECTIVE_ID = "Deaths";
const WELCOME_MESSAGE_TITLE = "§e[!] Welcome to Sleeplite Community 2025";
const WELCOME_DELAY_TICKS = 100;

const getOrCreateDeathScore = (player) => {
  const scoreboard = world.scoreboard.getObjective(DEATH_OBJECTIVE_ID);
  if (!scoreboard) return 0;

  const playerIdentity = player.scoreboardIdentity;
  let deathScore = 0;

  try {
    deathScore = scoreboard.getScore(playerIdentity) ?? 0;

    if (deathScore === 0 && !scoreboard.hasParticipant(playerIdentity)) {
      scoreboard.setScore(playerIdentity, 0);
      deathScore = 0;
    }
  } catch (e) {
    console.warn(`[Scoreboard] Failed to get/set death score for ${player.name}: ${e}`);
    return 0;
  }

  return deathScore;
};

export function Spawn(event) {
  const { player, initialSpawn } = event;

  if (!initialSpawn || !(player instanceof Player)) return;

  system.runTimeout(() => {
    const deathCount = getOrCreateDeathScore(player);

    player.sendMessage(`${WELCOME_MESSAGE_TITLE}\n§7Name: ${player.name}\nDeaths: ${deathCount}`);

    player.onScreenDisplay.setTitle(player.name, {
      fadeInDuration: 0,
      fadeOutDuration: 50,
      stayDuration: 160,
    });

    player.playSound("random.toast", { pitch: 1, volume: 1.5 });
  }, WELCOME_DELAY_TICKS);
}
