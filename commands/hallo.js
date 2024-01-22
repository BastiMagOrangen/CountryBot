module.exports = {
    data: {
        name: "hallo",
        description: "Antwortet mit hallo."
    },
    run: ({ interaction }) => {
        interaction.reply("Hallo, wie gehts?")
    },
    deleted: true
}