const { Schema, model } = require("mongoose")

const UserSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    catches: {
        type: Map,
        of: String,
        default: {}
    },
    scores: {
        type: Map,
        of: Number,
        default: {}
    }
})

module.exports = model("User", UserSchema)