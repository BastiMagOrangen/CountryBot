const { token } = require("./config.json")
const { Events, Client, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, ButtonBuilder, ComponentType, ButtonStyle } = require("discord.js")
const mongoose = require("mongoose")
const Guess = require("./guess")

const client = new Client({intents: []})



async function connectToDB(){
    try{
        mongoose.set("strictQuery", false)
        await mongoose.connect("mongodb://root:1234@localhost:27017")
        console.log("Connected to mongodb");
    } catch(error) {
        console.log(error);
    }
}

connectToDB();

client.on(Events.ClientReady, client => {
    console.log(client.user.tag + " ist bereit");
})

client.on("interactionCreate", async (interaction) => {
    console.log(client.channels.cache.get(interaction.channelId));
    if(!interaction.isChatInputCommand())
    {
        if(interaction.isButton() && interaction.customId === "guess-button") { 
            const modal = new ModalBuilder().setCustomId("guess-country").setTitle("Which country is that?")
            const nameInput = new TextInputBuilder().setCustomId("Name").setLabel("What country is searched?").setStyle(TextInputStyle.Short);
            const firstActionRow = new ActionRowBuilder().addComponents(nameInput)
            modal.addComponents(firstActionRow)
            await interaction.showModal(modal)
            var reply = await interaction.awaitModalSubmit({
                time: 60000
            }).catch(error => console.log(error))
            console.log(reply.fields.getTextInputValue("Name"));
            const guess = await Guess.findOne({guildId: interaction.guildId})
            var answer = reply.fields.getTextInputValue("Name")
            if(answer.toLowerCase() == guess.name.toLowerCase() || answer.toLowerCase() == guess.alternative.toLowerCase()){
                reply.reply({content: "<@" + reply.user + ">" + " hat " + answer + " richtig erraten"})
            }
            else reply.reply({content: "<@" + reply.user + ">" + " Antwort ist falsch"})
        }
        /* if(interaction.isModalSubmit() && interaction.customId === "guess-country")
        {
            const name = interaction.fields.getTextInputValue("Name")
            console.log(name);
            const guess = await Guess.findOne({guildId: interaction.guildId})
            console.log(guess);
            if(name.toLowerCase() == guess.name.toLowerCase() || name.toLowerCase() == guess.alternative.toLowerCase()) interaction.reply({content: "Richtig"});
            else interaction.reply({content: "Falsch"})
        } */
        return
    }
    console.log(interaction.commandName);
    if(interaction.commandName === "hallo") interaction.reply("Hallo wie gehts?")
    if(interaction.commandName === "guess") {
        const response = await fetch("http://localhost:3100/country/random")
        const f = await response.json()
        var name = f.name
        var alternative = f.alternatives
        var flag = f.flagURL
        console.log(name, alternative, flag);
        const query = {
            guildId: interaction.guildId
        }
        try{
            const guess = await Guess.findOne(query)
            if(guess) {
                guess.name = name,
                guess.alternative = alternative
                guess.channelId = interaction.channelId
                await guess.save().catch(e => {
                    console.log(e);
                    return
                })
            }
            else {
                const newGuess = new Guess({
                    guildId: interaction.guildId,
                    channelId: interaction.channelId,
                    name: name,
                    alternative: alternative
                })
                await newGuess.save()
            }
        } catch (error) {
            console.log(error);
        }
        const button = new ButtonBuilder().setLabel("Guess").setCustomId("guess-button").setStyle(ButtonStyle.Primary)
        const buttonRow = new ActionRowBuilder().addComponents(button)
        await interaction.reply({content: flag, components: [buttonRow]})
    }
})

client.login(token)