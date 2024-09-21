const { sendMessage } = require("../helpers/messageHelper");
const { generateCountry } = require("../services/countryService");

module.exports = {
  data: {
    name: "guess",
    description: "Guess a Country",
  },
  run: async ({ interaction }) => {
    const r = await generateCountry();
    console.log(
      `Current answer is ${r.name} (${r.birth}-${
        r.death
      }), with alternatives ${r.alternatives.toString()}`
    );
    sendCountry(
      interaction,
      r,
      async () => await incrementCountryCatch(interaction.user.id, r.id)
    );
  },
};
