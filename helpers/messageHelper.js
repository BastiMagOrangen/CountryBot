const {
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
  ButtonBuilder,
  ComponentType,
  ButtonStyle,
  EmbedBuilder,
  ButtonInteraction,
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
  return { id, name, alternatives, flag, map, birth, death, caught };
}

/**
 * @param {import('discord.js').ChatInputCommandInteraction} interaction
 * @param {Object} random
 * @param {(interaction: ButtonInteraction) => Boolean} onCorrect
 * @param {(interaction: ButtonInteraction) => Boolean} onSkip
 */
async function sendCountry(interaction, random, onCorrect, onSkip) {
  const button = new ButtonBuilder()
    .setLabel("Guess")
    .setCustomId("guess-button")
    .setStyle(ButtonStyle.Primary);
  const skip = new ButtonBuilder()
    .setLabel("Skip")
    .setCustomId("skip-button")
    .setStyle(ButtonStyle.Secondary);
  const buttonRow = new ActionRowBuilder().addComponents(button, skip);
  const embed = new EmbedBuilder()
    .setColor(0xe37f5d)
    .setTitle("Guess the Country!")
    .setImage(random.map)
    .setFields([
      { name: "Founding Year", value: random.birth + "", inline: true },
      { name: "Death Year", value: random.death + "", inline: true },
    ])
    .setThumbnail(random.flag);
  const newInteraction = await interaction.channel.send({
    embeds: [embed],
    components: [buttonRow],
  });
  //console.log(newInteraction);
  const collector = newInteraction.createMessageComponentCollector({
    ComponentType: ComponentType.Button,
  });

  collector.on("collect", async (i) => {
    if (random.caught) return;
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
      var reply = await i.awaitModalSubmit({ time: 100000 }).catch((e) => {});
      var answer = reply.fields.getTextInputValue("name");
      //check if no one caught already, then check if answer is correct
      try {
        if (!random.caught) {
          if (
            answer.toLowerCase() == random.name.toLowerCase() ||
            random.alternatives.includes(answer.toLowerCase())
          ) {
            if (await onCorrect(reply)) {
              buttonRow.components[0].setDisabled(true);
              await newInteraction.edit({
                embeds: [embed],
                components: [buttonRow],
              });
              random.caught = true;
            }
          } else
            await reply.reply({
              content: "`" + answer + "` is wrong! ❌",
              ephemeral: true,
            });
        }
      } catch (e) {
        console.log(e);
      }
    } else if (i.customId == "skip-button") {
      if (await onSkip(i)) {
        buttonRow.components[0].setDisabled(true);
        await newInteraction.edit({ embeds: [embed], components: [buttonRow] });
      }
    }
  });

  collector.on("dispose", async (i) => {
    console.log("disposing");
  });
  // when timer runs out
  collector.on("end", async (i) => {
    buttonRow.components[0].setDisabled(true);
    await interaction.editReply({ embeds: [embed], components: [buttonRow] });
  });
}

module.exports = {
  getPrettyFormat,
  sendCountry,
};
