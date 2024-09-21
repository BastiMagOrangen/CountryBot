const { Schema, model } = require("mongoose")

const ServerSchema = new Schema({
    id: {
        type: Number,
        required: true
    }
});

module.exports = model("Server", ServerSchema)
