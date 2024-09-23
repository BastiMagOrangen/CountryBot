const CommonsExecutor = require("../games/commons");

const { newGame, clearGames } = require("../services/gameService");

const {
  ButtonBuilder,
  EmbedBuilder,
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonStyle,
  ComponentType,
  ChatInputCommandInteraction,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Play a game")
    .addStringOption((builder) =>
      builder
        .setName("type")
        .setDescription("Type of game")
        .setRequired(true)
        .setChoices(
          { name: "Countries", value: "countries" },
          { name: "Dead by Daylight", value: "deadbydaylight" }
        )
    )
    .addIntegerOption((builder) =>
      builder.setName("max_players").setDescription("Max number of players")
    )
    .addIntegerOption((builder) =>
      builder.setName("goal").setDescription("Amount of points to win")
    ),

  /**
   * @param {{interaction: ChatInputCommandInteraction}} param0
   */
  run: async ({ interaction }) => {
    const type = interaction.options.getString("type");
    const maxPlayers = interaction.options.getInteger("max_players");
    const goal = interaction.options.getInteger("goal");

    // Create the embed message
    const embed = new EmbedBuilder()
      .setTitle(`A game is being started`)
      .setDescription(
        `The host will wait for everyone to join and then start the game.\n`
      )
      .setColor("#0099ff")
      .addFields(
        { name: "Host 🧑‍💼", value: interaction.user.username },
        { name: "Max Players 👥", value: maxPlayers || "∞" },
        { name: "Goal 🎯", value: goal || "10" },
        { name: "Type 🎮", value: type }
      );

    const startButton = new ButtonBuilder()
      .setCustomId("start_game")
      .setLabel("Start")
      .setStyle(ButtonStyle.Primary); // Primary style for the start button

    const joinButton = new ButtonBuilder()
      .setCustomId("join_game")
      .setLabel("Join")
      .setStyle(ButtonStyle.Success); // Success style for the join button

    const row = new ActionRowBuilder().addComponents(startButton, joinButton);

    // Send the embed and buttons
    const msg = await interaction.reply({ embeds: [embed], components: [row] });
    const collector = msg.createMessageComponentCollector({
      componentType: ComponentType.Button,
    });

    let players = [];

    collector.on("collect", async (comp) => {
      // Handle the join button
      if (comp.customId === "join_game") {
        if (maxPlayers && players.length >= maxPlayers) {
          await comp.reply({
            content: "Sorry, the game is already **full** ❌",
            ephemeral: true,
          });
          return;
        }
        if (players.includes(comp.user.id)) {
          await comp.reply({
            content: "You have already **joined** the game ❌",
            ephemeral: true,
          });
          return;
        }
        players.push(comp.user.id);
        await comp.reply({
          content:
            "**" + comp.user.displayName + "** has **joined** the game ⏩",
        });
        // Handle the start button
      } else if (comp.customId === "start_game") {
        if(comp.user.id !== interaction.user.id) {
          await comp.reply({
            content: "You need to be the **host** to start the game ❌",
            ephemeral: true,
          });
          return;
        }
        if (players.length < 1) {
          await comp.reply({
            content: "You need at least **1 player** to start the game ❌",
            ephemeral: true,
          });
          return;
        }
        clearGames();
        const game = await newGame(
          comp.guild.id,
          comp.channel.id,
          comp.user.id,
          players,
          type,
          goal
        );
        await comp.reply({
          content: "The game has **started** ▶️",
        });

        //disable buttons
        row.components.forEach((c) => c.setDisabled(true));
        await interaction.editReply({ embeds: [embed], components: [row] });

        // start
        new CommonsExecutor().startGameProcedures(interaction, game.uuid, type);
      }
    });
  },
};
