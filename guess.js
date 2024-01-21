const { Schema, model } = require("mongoose")

const GuessSchema = new Schema({
    guildId: {
        type: String,
        required: true
    },
    channelId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    alternative: {
        type: String,
        required: false
    }
})

module.exports = model("Guess", GuessSchema)