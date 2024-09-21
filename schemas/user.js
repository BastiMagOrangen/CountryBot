const { Schema, model } = require("mongoose")

const UserSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    catches: {
        type: Map,
        of: String,
        default: {}
    }
})

module.exports = model("User", UserSchema)