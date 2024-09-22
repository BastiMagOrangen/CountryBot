const mongoose = require("mongoose");
const User = require("./user");
const { v4: uuidv4 } = require("uuid");

const GameUserSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
    required: true,
  },
  points: {
    type: Number,
    required: true,
    default: 0,
  },
});

module.exports = mongoose.model("GameUser", GameUserSchema);
