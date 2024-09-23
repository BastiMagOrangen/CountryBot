const mongoose = require("mongoose");
const User = require("./user");
const Game = require("./game");

const GameUserSchema = new mongoose.Schema({
  user: {
    type: Number,
    required: true,
  },
  points: {
    type: Number,
    required: true,
    default: 0,
  },
  game: {
    type: String
  },
});

module.exports = mongoose.model("GameUser", GameUserSchema);
