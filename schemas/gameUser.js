const mongoose = require('mongoose');
const User = require("./user");

const GameUserSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: true
    },
    points: {
        type: Number,
        required: true
    },
});


module.exports = mongoose.model('GameUser', GameUserSchema);
