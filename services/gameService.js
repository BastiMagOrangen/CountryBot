const Game = require("../schemas/game");
const GameUser = require("../schemas/gameUser");
const { getOrCreateUser } = require("./userService");
const { getOrCreateServer } = require("./serverService");
const mongoose = require("mongoose");

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
    players.map(async (player) => await getOrCreateGameUser(player))
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

async function getOrCreateGameUser(userId) {
  let user = await GameUser.findOne({ id: userId });
  if (!user) {
    user = new GameUser({ user: await getOrCreateUser(userId) });
    user.save();
  }
  return user;
}

async function addPoints(gameId, userId, points) {
  const game = await Game.findOne({ uuid: gameId });
  console.log(game.toObject());
  const player = game.players.find((player) => {
    console.log(player);
    return player.user.id === userId;
  });
  await player.save();
  const newPoints = (player.points += points);
  const user = player.user;
  if (user.scores.has(countryId)) {
    // Increment the existing count
    user.scores.set(countryId, parseInt(user.catches.get(countryId), 10) + 1);
  } else {
    // Add a new entry for the countryId
    user.scores.set(countryId, 1);
  }
  await user.save();
  return newPoints;
}

async function clearGames() {
  await Game.deleteMany({});
  console.log("Games cleared!");
}

async function getGame(gameId) {
  return await Game.findOne({ uuid: gameId });
}

module.exports = {
  newGame,
  clearGames,
  getGame,
  addPoints,
};
