const { addPoints, getGame } = require("../services/gameService");

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
                  executor.onCorrect(interaction, random);
                  
                  const points = await addPoints(
                    gameId,
                    interaction.user.id,
                    1
                  );
                  const game = await getGame(gameId);
                  if (points < game.goal) {
                    this.sendMessage(interaction, executor, gameId);
                  }
                  interaction.channel.send({
                    content:
                      "**" +
                      interaction.user.username +
                      "** now has `" +
                      points +
                      "/" +
                      game.goal +
                      "` points!",
                  });
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
