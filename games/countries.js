const { sendCountry } = require("../helpers/messageHelper");
const { generateCountry } = require("../services/countryService");
const { incrementCountryCatch } = require("../services/userService");

class CountriesExecutor {
    async newQuestion(interaction, gameId) {
        const random = await generateCountry();
        console.log(random);
        
        sendCountry(interaction, random, async (i) => {
            await incrementCountryCatch(interaction.user.id, random.id);
        });
    }
    answerEquals(string, answer) {

    }
}

module.exports = CountriesExecutor;