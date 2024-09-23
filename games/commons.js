const { addPoints, getGame, getPlayer, deleteGame } = require("../services/gameService");

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
                executor.sendQuestion(interaction, random, async (i) => {
                  if ((await getPlayer(i.user.id, gameId)) === null) {
                    await i.reply({
                      content: "You are not participating in this game! ⛔",
                      ephemeral: true,
                    });
                    return false;
                  }
                  executor.onCorrect(interaction, random);

                  const points = await addPoints(gameId, i.user.id, 1);
                  const game = await getGame(gameId);
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
                      content:
                        "**" +
                        i.user.username +
                        "** won the game! 🎉",
                    });
                    await deleteGame(gameId);
                  }
                  return true;
                });
              }, 800);
            });
          }, 800);
        });
      }, 800);
    });
  }
}

module.exports = CommonsExecutor;
