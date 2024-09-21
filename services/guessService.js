const Guess = require("../schemas/guess");

async function findGuessByGuildId(guildId) {
  try {
    const guess = await Guess.findOne({ guildId });
    return guess;
  } catch (error) {
    console.error("Error finding guess by guildId:", error);
    throw new Error("Failed to find guess");
  }
}

async function createOrUpdateGuess(guildId, channelId, name, alternatives) {
  try {
    let guess = await Guess.findOne({ guildId });
    if (guess) {
      // Update existing guess
      guess.name = name;
      guess.alternative = alternatives;
      guess.channelId = channelId;
    } else {
      // Create a new guess
      guess = new Guess({
        guildId,
        channelId,
        name,
        alternatives,
      });
    }
    await guess.save();
    return guess;
  } catch (error) {
    console.error("Error creating or updating guess:", error);
    throw new Error("Failed to save guess");
  }
}

module.exports = {
  findGuessByGuildId,
  createOrUpdateGuess,
};