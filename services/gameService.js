const Game = require("../schemas/game");
const { getOrCreateUser } = require("./userService");
const { getOrCreateServer } = require("./serverService");

// Import necessary schemas

// Function to create a new game
/**
 *
 * @param {Number} server
 * @param {Number} channel
 * @param {Number} host
 * @param {Number[]} players
 * @param {"countries" || "deadbydaylight"} type
 * @param {Number} goal
 * @returns {Game}
 */
async function newGame(server, channel, host, players, type, goal) {
  const castedPlayers = await Promise.all(
    players.map(async (player) => await getOrCreateUser(player))
  );

  try {
    const newGame = new Game({
      server: await getOrCreateServer(server),
      channel,
      host: await getOrCreateUser(host),
      players: castedPlayers,
      type,
      goal: goal || 10,
    });
    newGame.save();
    const id = newGame.toObject();
    return id;
  } catch (error) {
    console.error("Error creating new game:", error);
    throw error;
  }
}

async function clearGames() {
    await Game.deleteMany({});
    console.log("Games cleared!");
    
}

async function getGame(gameId) {
  return await Game.findOne({ id: gameId });
}

module.exports = {
  newGame, clearGames, 
};
