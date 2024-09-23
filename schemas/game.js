const { Schema, model } = require("mongoose");
const Server = require("./server");
const User = require("./user");
const GameUser = require("./gameUser");
const { v4: uuidv4 } = require("uuid");

const GameSchema = new Schema({
  uuid: {
    type: String,
    default: uuidv4,
    uniqe: true,
  },
  server: {
    type: Number,
    required: true,
  },
  channel: {
    type: Number,
    required: true,
  },
  host: {
    type: Number,
    required: true,
  },
  players: {
    type: Array,
    of: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ["countries", "deadbydaylight"],
    required: true,
  },
  goal: {
    type: Number,
    default: 10,
  },
});

module.exports = model("Game", GameSchema);
