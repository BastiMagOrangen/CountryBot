const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const { getUserCatches, getUserScores } = require("../services/userService");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("scores")
    .setDescription("Displays all your scores")
    .addStringOption((builder) =>
      builder
        .setName("type")
        .setDescription("The game type")
        .setRequired(true)
        .setChoices(
          { name: "Countries", value: "countries" },
          { name: "Dead by Daylight", value: "deadbydaylight" }
        )
    ),
  run: async ({ interaction }) => {
    const type = interaction.options.getString("type");
    const scores = await getUserScores(interaction.user.id, type);
    let description = "";

    scores.forEach((v, k, m) => {
      description += `**${k}**: ${v}\n`;
    });
    const embed = new EmbedBuilder()
      .setTitle("Your Scores")
      .setColor("#0099ff")
      .setDescription(description);

    await interaction.reply({ embeds: [embed] });
  },
};
