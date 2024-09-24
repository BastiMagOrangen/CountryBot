const {
  addPoints,
  getGame,
  getPlayer,
  deleteGame,
  setAndCheckSkips,
} = require("../services/gameService");

const CountriesExecutor = require("./countries");
const DBDExecutor = require("./deadbydaylight");

class CommonsExecutor {
  async startGameProcedures(interaction, gameId, type) {
    //set executor and start game
    let executor;
    if (type === "countries") {
      executor = new CountriesExecutor();
    } else if (type === "deadbydaylight") {
      executor = new DBDExecutor();
    }

    this.sendMessage(interaction, executor, gameId);
  }

  async sendMessage(interaction, executor, gameId) {
    interaction.channel.send("3️⃣").then((message) => {
      setTimeout(() => {
        message.edit("2️⃣").then((message) => {
          setTimeout(() => {
            message.edit("1️⃣").then((message) => {
              setTimeout(async () => {
                message.delete();
                const random = await executor.generateNew();
                console.log(random);
                const game = await getGame(gameId);
                executor.sendQuestion(
                  interaction,
                  random,
                  async (i) => {
                    if ((await getPlayer(i.user.id, gameId)) === null) {
                      await i.reply({
                        content: "You are not participating in this game! ⛔",
                        ephemeral: true,
                      });
                      return false;
                    }
                    executor.onCorrect(interaction, random);
                    const points = await addPoints(gameId, i.user.id, 1);
                    await i.reply({
                      content:
                        "**" +
                        i.user.displayName +
                        "** got `" +
                        random.name +
                        "` right",
                    });
                    interaction.channel.send({
                      content:
                        "**" +
                        i.user.username +
                        "** now has `" +
                        points +
                        "/" +
                        game.goal +
                        "` points!",
                    });

                    if (points < game.goal) {
                      this.sendMessage(interaction, executor, gameId);
                    } else {
                      interaction.channel.send({
                        content: "**" + i.user.username + "** won the game! 🎉",
                      });
                      await deleteGame(gameId);
                    }
                    return true;
                  },
                  async (i) => {
                    if ((await getPlayer(i.user.id, gameId)) === null) {
                      await i.reply({
                        content: "You are not participating in this game! ⛔",
                        ephemeral: true,
                      });
                      return false;
                    }
                    let skips = 0;
                    if (
                      (skips = await setAndCheckSkips(gameId, i.user.id)) ===
                      game.players.length
                    ) {
                      interaction.channel.send({
                        content:
                          "Everyone skipped! The answer was `" +
                          random.name +
                          "`",
                      });
                      this.sendMessage(interaction, executor, gameId);
                      return true;
                    } else {
                      await i.reply({
                        content:
                          "**" +
                          i.user.displayName +
                          "** wants to skip (`" +
                          skips +
                          "/" +
                          game.players.length +
                          "`)! ⏩",
                      });
                    }
                    return false;
                  }
                );
              }, 800);
            });
          }, 800);
        });
      }, 800);
    });
  }
}

module.exports = CommonsExecutor;
