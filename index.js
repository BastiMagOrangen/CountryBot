const { token } = require("./config.json")
const { IntentsBitField, Client } = require("discord.js")
const mongoose = require("mongoose")
//const Guess = require("./guess")
const { CommandHandler } = require("djs-commander")
const path = require("path")

const client = new Client({intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent
]})

new CommandHandler({
    client,
    eventsPath: path.join(__dirname, "events"),
    commandsPath: path.join(__dirname, "commands")
});

(async () => {
    try{
        mongoose.set("strictQuery", false)
        await mongoose.connect("mongodb://root:1234@localhost:27017")
        client.login(token)
        console.log("Connected to mongodb");
    } catch(error) {
        console.log(error);
    }
})();

