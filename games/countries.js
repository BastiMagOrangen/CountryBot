const { sendCountry } = require("../helpers/messageHelper");
const { generateCountry } = require("../services/countryService");
const { addPoints, getGame } = require("../services/gameService");
const { incrementCountryCatch } = require("../services/userService");

class CountriesExecutor {
  async generateNew() {
    return await generateCountry();
  }
  async onCorrect(interaction, random) {
    await incrementCountryCatch(interaction.user.id, random.id);
  }
  async sendQuestion(interaction, random, onCorrect, onSkip) {
    sendCountry(interaction, random, onCorrect, onSkip);
  }
  answerEquals(string, answer) {}
}

module.exports = CountriesExecutor;
