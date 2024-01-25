const {
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
  ButtonBuilder,
  ComponentType,
  ButtonStyle,
  EmbedBuilder
} = require("discord.js");
const Guess = require("../schemas/guess");

module.exports = {
  data: {
    name: "guess",
    description: "Guess a Country",
  },
  run: async ({ interaction }) => {
    const response = await fetch("http://localhost:3100/country/random");
    const f = await response.json();
    let name = f.name;
    let alternative = f.alternatives;
    let flag = f.flagURL;
    let map = f.mapURL;
    console.log(name, alternative, flag);
    const query = {
      guildId: interaction.guildId,
    };
    try {
      const guess = await Guess.findOne(query);
      if (guess) {
        (guess.name = name), (guess.alternative = alternative);
        guess.channelId = interaction.channelId;
        await guess.save().catch((e) => {
          console.log(e);
          return;
        });
      } else {
        const newGuess = new Guess({
          guildId: interaction.guildId,
          channelId: interaction.channelId,
          name: name,
          alternative: alternative,
        });
        await newGuess.save();
      }
    } catch (error) {
      console.log(error);
    }
    const button = new ButtonBuilder()
      .setLabel("Guess")
      .setCustomId("guess-button")
      .setStyle(ButtonStyle.Primary);
    const buttonRow = new ActionRowBuilder().addComponents(button);
    const embed = new EmbedBuilder().setColor(0xe37f5d).setTitle("Guess the Country!").setImage(map).setThumbnail(flag);
    const pressed = await interaction.reply({
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
          .setCustomId("Name")
          .setLabel("What country is searched?")
          .setStyle(TextInputStyle.Short);
        const firstActionRow = new ActionRowBuilder().addComponents(nameInput);
        modal.addComponents(firstActionRow);
        await i.showModal(modal);
        var reply = await i
          .awaitModalSubmit({
            time: 60000,
          })
          .catch((error) => {});
        console.log(reply.fields.getTextInputValue("Name"));
        var answer = reply.fields.getTextInputValue("Name");
        //bug must be somewhere here
        if (
          answer.toLowerCase() == name.toLowerCase() ||
          answer.toLowerCase() == alternative.toLowerCase()
        ) {
          buttonRow.components[0].setDisabled(true);
          interaction.editReply({ content: flag, components: [buttonRow] });
          reply.reply({
            content: "<@" + reply.user + ">" + " got " + name + " right",
          });
        } else
          reply.reply({
            content: "<@" + reply.user + ">" + " Answer is wrong",
            ephemeral: true,
          });
      }
    });

    collector.on("end", async (i) => {
      buttonRow.components[0].setDisabled(true);
      interaction.editReply({ embeds: [embed], components: [buttonRow] });
    });
  },
};
