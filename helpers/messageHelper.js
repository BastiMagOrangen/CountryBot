const {
    ModalBuilder,
    ActionRowBuilder,
    TextInputBuilder,
    TextInputStyle,
    ButtonBuilder,
    ComponentType,
    ButtonStyle,
    EmbedBuilder,
  } = require("discord.js");
const { incrementCountryCatch } = require("../services/userService");

function getPrettyFormat(f) {
    let id = f.id;
    let name = f.name;
    let alternatives = f.alternatives.toLowerCase().split(",");
    let flag = f.flagURL;
    let map = f.mapURL;
    let birth = f.birthYear;
    let death = f.deathYear;
    let caught = false;
    return {id, name, alternatives, flag, map, birth, death, caught};
}

/**
 * @param {import('discord.js').ChatInputCommandInteraction} interaction 
 */
async function sendCountry(interaction, random, onCorrect) {
    const button = new ButtonBuilder()
      .setLabel("Guess")
      .setCustomId("guess-button")
      .setStyle(ButtonStyle.Primary);
    const buttonRow = new ActionRowBuilder().addComponents(button);
    const embed = new EmbedBuilder()
      .setColor(0xe37f5d)
      .setTitle("Guess the Country!")
      .setImage(random.map)
      .setFields([
        { name: "Founding Year", value: random.birth + "", inline: true },
        { name: "Death Year", value: random.death + "", inline: true },
      ])
      .setThumbnail(random.flag);
    const pressed = await interaction.channel.send({
      embeds: [embed],
      components: [buttonRow],
    });
    //console.log(pressed);
    const collector = pressed.createMessageComponentCollector({
      ComponentType: ComponentType.Button,
      time: 60000,
    });

    collector.on("collect", async (i) => {
      if (i.customId == "guess-button") {
        const modal = new ModalBuilder()
          .setCustomId("guess-country")
          .setTitle("Which country is that?");
        const nameInput = new TextInputBuilder()
          .setCustomId("name")
          .setLabel("Countryname")
          .setStyle(TextInputStyle.Short);
        const firstActionRow = new ActionRowBuilder().addComponents(nameInput);
        modal.addComponents(firstActionRow);
        await i.showModal(modal);
        var reply = await i
          .awaitModalSubmit({
            time: 60000,
          })
          .catch((error) => {});
        var answer = reply.fields.getTextInputValue("name");
        //check if no one caught already, then check if answer is correct
        if (!random.caught) {
          if (
            answer.toLowerCase() == random.name.toLowerCase() ||
            random.alternatives.includes(answer.toLowerCase())
          ) {
            buttonRow.components[0].setDisabled(true);
            pressed.edit({ embeds: [embed], components: [buttonRow] });
            reply.reply({
              content: "**" + reply.user.displayName + "** got `" + random.name + "` right",
            });
            random.caught = true;
            await onCorrect(reply);
          } else
            reply.reply({
              content: "``" + answer + "` is wrong! ❌",
              ephemeral: true,
            });
        }
      }
    });

    // when timer runs out
    collector.on("end", async (i) => {
      buttonRow.components[0].setDisabled(true);
      interaction.editReply({ embeds: [embed], components: [buttonRow] });
    });
};

module.exports = {
    getPrettyFormat,
    sendCountry,
}