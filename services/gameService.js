const Game = require("../schemas/game");
const User = require("../schemas/user");
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
    players.map(async (player) => (await getOrCreateGameUser(player)).user)
  );

  try {
    const newGame = new Game({
      server: (await getOrCreateServer(server)).id,
      channel,
      host: (await getOrCreateUser(host)).id,
      players: castedPlayers,
      type,
      goal: goal || 10,
    });
    newGame.save();
    const game = newGame.toObject();

    await Promise.all([
      castedPlayers.forEach(
        async (p) => await addGamePropToPlayer(p, game.uuid)
      ),
    ]);

    return game;
  } catch (error) {
    console.error("Error creating new game:", error);
    throw error;
  }
}

async function addGamePropToPlayer(playerId, gameId) {
  const player = await GameUser.findOne({ user: playerId });
  player.game = gameId;
  await player.save();
}

async function getOrCreateGameUser(userId) {
  let user = await GameUser.findOne({ id: userId });
  if (!user) {
    user = new GameUser({ user: (await getOrCreateUser(userId)).id });
    user.save();
  }
  return user;
}

async function getPlayer(userId, gameId) {
  const gameUser = await GameUser.findOne({ user: userId, game: gameId });
  return gameUser;
}

async function addPoints(gameId, userId, points) {
  const player = await getPlayer(userId, gameId);
  const user = await getOrCreateUser(userId);
  const game = await getGame(gameId);
  console.log("User adding points");
  console.log(user.id);
  console.log(player.points);
  const newPoints = player.points + points;
  player.points = newPoints;

  if (user.scores.has(game.type)) {
    user.scores.set(game.type, parseInt(user.scores.get(game.type), 10) + 1);
  } else {
    user.scores.set(game.type, 1);
  }

  await Promise.all([user.save(), player.save()]);
  return newPoints;
}

async function setAndGetSkips(gameId, userId) {
  const player = await getPlayer(userId, gameId);
  player.skipping = true;
  await player.save();

  const game = await getGame(gameId);
  const skips = game.skips + 1;
  game.skips = skips;
  await game.save();
  return skips;
}

async function clearGames() {
  await Game.deleteMany({});
  await GameUser.deleteMany({});
}

async function deleteGame(gameId) {
  await GameUser.deleteMany({ game: gameId });
  await Game.deleteOne({ uuid: gameId });
  console.log("Game deleted");
}

async function getGame(gameId) {
  return await Game.findOne({ uuid: gameId });
}

module.exports = {
  newGame,
  clearGames,
  getGame,
  addPoints,
  deleteGame,
  getPlayer,
  setAndGetSkips
};
