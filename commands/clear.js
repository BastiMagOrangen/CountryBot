module.exports = {
    data: {
        name: "clear",
        description: "Clears the whole Channel"
    },
    run: async ({ interaction }) => {
        const messages = interaction.channel.messages.fetch()
        await interaction.channel.bulkDelete(messages)
        interaction.channel.send("All Messages deleted!")
    }
}