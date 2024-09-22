const { EmbedBuilder } = require("discord.js");
const { getUserCatches } = require("../services/userService");

module.exports = {
  data: {
    name: "catches",
    description: "Display all catches for the current user",
  },
  run: async ({ interaction }) => {
    try {
      const userCatches = await getUserCatches(interaction.user.id);

      // Check if the user has catches
      if (Object.keys(userCatches).length === 0) {
        return interaction.reply({
          content: "You haven't caught any countries yet!",
          ephemeral: true,
        });
      }

      // Create an embed for displaying the catches
      const catchesEmbed = new EmbedBuilder()
        .setColor(0x00ff00) // Choose a nice color for the embed
        .setTitle(`${interaction.user.username}'s Country Catches`)
        .setDescription("Here are the countries you have caught so far!")
        .setThumbnail(interaction.user.displayAvatarURL()) // Add the user's avatar
        .setFooter({ text: "Keep catching more countries!" })
        .setTimestamp(); // Include a timestamp

      // Add a field for each country and the number of catches
      console.log(userCatches);
            
      for (const [countryId, count] of userCatches) {
        const response = await fetch(`http://localhost:3100/country/id/${countryId}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();

        catchesEmbed.addFields({
          name: data.name,
          value: `[Flag](${data.flagURL})\nCatches: ${count}`,
          inline: true,
        });
      }

      // Send the embed to the channel
      await interaction.reply({ embeds: [catchesEmbed] });
    } catch (error) {
      console.error("Error displaying user catches:", error);
      await interaction.reply({
        content: "An error occurred while fetching your catches.",
        ephemeral: true,
      });
    }
  },
};
